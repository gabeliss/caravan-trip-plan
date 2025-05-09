import { supabase } from './supabaseClient';
import { User } from '../types';

export const authService = {
  /**
   * Get the current logged in user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
  
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('⚠️ authService: getSession timed out after 5s');
          resolve(null);
        }, 5000);
      });
  
      const sessionResponse = await Promise.race([
        supabase.auth.getSession().then(({ data }) => data.session),
        timeout
      ]);
  
      if (!sessionResponse || !sessionResponse.user) {
        return null;
      }
  
      return await this._fetchCurrentUser(sessionResponse.user);
    } catch (err) {
      console.error('❌ Error in getCurrentUser:', err);
      return null;
    }
  },
  

  // Private method to fetch current user data
  async _fetchCurrentUser(user: any): Promise<User | null> {
    try {
  
      if (!user.email_confirmed_at && user.confirmation_sent_at) {
        return null;
      }
  
      // Fetch user profile
      let { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
  
      if (error && error.code === 'PGRST116') {
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'User',
          created_at: new Date().toISOString()
        });
  
        if (insertError) {
          console.error('❌ Failed to create user profile:', insertError);
          return null;
        }
  
        const { data: newUserData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
  
        userData = newUserData;
      }
  
      if (!userData) {
        return null;
      }
  
      // Fetch trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id);
  
      const trips = tripsData?.map(trip => ({
        id: trip.id,
        confirmationId: trip.confirmation_id,
        trip_details: {
          destination: trip.trip_details.destination,
          nights: trip.trip_details.nights,
          startDate: new Date(trip.trip_details.startDate),
          guestCount: trip.trip_details.guestCount
        },
        selectedCampgrounds: trip.campgrounds,
        createdAt: trip.created_at,
        status: trip.status,
        guideUrl: trip.guide_url
      })) || [];
  
      const currentUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        trips
      };
  
      return currentUser;
    } catch (error) {
      console.error('❌ authService: Error in _fetchCurrentUser:', error);
      return null;
    }
  },

  /**
   * Sign in a user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ authService: Supabase authentication error:', error);
        throw error;
      }
      
      
      // Check if email is confirmed
      if (!data.user.email_confirmed_at && data.user.confirmation_sent_at) {
        throw new Error('Please confirm your email before logging in. Check your inbox for the confirmation link.');
      }
      
      // Get user profile data
      // Fetch user profile data with timeout
      const userProfilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfileTimeout = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('⚠️ authService: User profile query timed out after 5s');
          resolve(null);
        }, 5000);
      });

      const userData = await Promise.race([userProfilePromise.then(res => res.data), userProfileTimeout]);

      if (!userData) {
        throw new Error('User profile fetch timed out or failed');
      }
      
      
      // Get user trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', data.user.id);
      
      if (tripsError) {
        console.error('❌ authService: Error fetching user trips:', tripsError);
        // Continue anyway, just with empty trips array
      }
      
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        trips: tripsData ? tripsData.map(trip => ({
          id: trip.id,
          confirmationId: trip.confirmation_id,
          trip_details: {
            destination: trip.trip_details.destination,
            nights: trip.trip_details.nights,
            startDate: new Date(trip.trip_details.startDate),
            guestCount: trip.trip_details.guestCount
          },
          selectedCampgrounds: trip.campgrounds,
          createdAt: trip.created_at,
          status: trip.status,
          guideUrl: trip.guide_url
        })) : []
      };
      
      return user;
    } catch (error) {
      console.error('❌ authService: Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user with email, password and name
   */
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      // Register the user with Supabase Auth - pass name as metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name // Add the name in the user metadata
          }
        }
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('User creation failed');
      
      // Check if confirmation email was sent
      if (data.user.confirmation_sent_at) {
        // A confirmation email was sent and needs to be confirmed
        throw new Error('Please check your email inbox and confirm your account before logging in.');
      }
      
      // The trigger function will create the profile record automatically
      // We don't need to create it manually anymore
      
      // Just return the user data
      return {
        id: data.user.id,
        email,
        name,
        trips: []
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      
      // Try both local and global signout to ensure complete logout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Supabase signout error:', error);
        throw error;
      }
      
      
      // Clear any local storage items that might be keeping state
      localStorage.removeItem('supabase.auth.token');
      
      // Give the system a moment to process the signout
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}; 