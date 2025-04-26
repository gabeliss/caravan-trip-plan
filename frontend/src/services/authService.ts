import { supabase } from './supabaseClient';
import { User } from '../types';

export const authService = {
  /**
   * Get the current logged in user
   */
  async getCurrentUser(): Promise<User | null> {
    // Add a timeout to prevent hanging indefinitely
    const timeoutPromise = new Promise<User | null>((resolve) => {
      setTimeout(() => {
        console.error('❌ authService: getCurrentUser timed out after 5 seconds');
        resolve(null);
      }, 5000);
    });

    try {
      console.log('🔍 authService: Getting current user...');
      
      // Race the actual operation against the timeout
      return await Promise.race([
        this._fetchCurrentUser(),
        timeoutPromise
      ]);
    } catch (error) {
      console.error('❌ authService: Error getting current user:', error);
      return null;
    }
  },

  // Private method to fetch current user data
  async _fetchCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('⚠️ authService: No active session found');
        return null;
      }
      
      console.log('✅ authService: Supabase session found for user:', user.id);
      
      // Check if email is confirmed
      if (!user.email_confirmed_at && user.confirmation_sent_at) {
        console.log('⚠️ authService: Email not confirmed yet, please check inbox');
        return null;
      }
      
      try {
        // Get user profile data
        console.log('🔍 authService: Fetching user profile data...');
        let { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('❌ authService: Error fetching user profile:', error);
          
          // If no user profile exists but auth user does, create profile
          if (error.code === 'PGRST116') {
            try {
              // Try to create the user profile
              console.log('🔍 authService: Creating user profile...');
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata?.name || 'User',
                  created_at: new Date().toISOString()
                });
                
              if (insertError) {
                console.error('❌ authService: Error creating user profile:', insertError);
                return null;
              }
              
              // Try getting the user again
              const { data: newUserData, error: newError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
                
              if (newError) {
                console.error('❌ authService: Error fetching newly created profile:', newError);
                return null;
              }
              
              if (!newUserData) {
                console.error('❌ authService: Newly created user data is null');
                return null;
              }
              
              userData = newUserData;
              console.log('✅ authService: User profile created successfully');
            } catch (profileError) {
              console.error('❌ authService: Error in profile creation flow:', profileError);
              return null;
            }
          } else {
            return null;
          }
        }
        
        if (!userData) {
          console.error('❌ authService: User data is null');
          return null;
        }
        
        console.log('✅ authService: User profile fetched successfully');
        
        try {
          // Get user trips
          console.log('🔍 authService: Fetching user trips...');
          const { data: tripsData, error: tripsError } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', user.id);
          
          if (tripsError) {
            console.error('❌ authService: Error fetching user trips:', tripsError);
            // Continue anyway with empty trips array
          } else {
            console.log('✅ authService: User trips fetched, count:', tripsData?.length || 0);
          }
          
          const currentUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            trips: tripsData ? tripsData.map(trip => ({
              id: trip.id,
              confirmationId: trip.confirmation_id,
              destination: trip.destination,
              duration: trip.duration,
              selectedCampgrounds: trip.campgrounds,
              createdAt: trip.created_at,
              status: trip.status,
              guideUrl: trip.guide_url
            })) : []
          };
          
          console.log('✅ authService: getCurrentUser completed successfully');
          return currentUser;
        } catch (tripsError) {
          console.error('❌ authService: Error in trips fetch flow:', tripsError);
          // Create user without trips
          const currentUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            trips: []
          };
          
          console.log('✅ authService: getCurrentUser completed with empty trips array');
          return currentUser;
        }
      } catch (profileError) {
        console.error('❌ authService: Error in profile/trips flow:', profileError);
        return null;
      }
    } catch (error) {
      console.error('❌ authService: Error getting current user in _fetchCurrentUser:', error);
      return null;
    }
  },

  /**
   * Sign in a user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('🔍 authService: Starting login with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ authService: Supabase authentication error:', error);
        throw error;
      }
      
      console.log('✅ authService: Supabase authentication successful for user:', data.user.id);
      
      // Check if email is confirmed
      if (!data.user.email_confirmed_at && data.user.confirmation_sent_at) {
        console.log('⚠️ authService: Email not confirmed for user');
        throw new Error('Please confirm your email before logging in. Check your inbox for the confirmation link.');
      }
      
      // Get user profile data
      console.log('🔍 authService: Fetching user profile data...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('❌ authService: Error fetching user profile:', userError);
        throw new Error('User profile not found');
      }
      
      if (!userData) {
        console.error('❌ authService: User data is null');
        throw new Error('User profile not found');
      }
      
      console.log('✅ authService: User profile fetched successfully');
      
      // Get user trips
      console.log('🔍 authService: Fetching user trips...');
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', data.user.id);
      
      if (tripsError) {
        console.error('❌ authService: Error fetching user trips:', tripsError);
        // Continue anyway, just with empty trips array
      } else {
        console.log('✅ authService: User trips fetched successfully, count:', tripsData?.length || 0);
      }
      
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        trips: tripsData ? tripsData.map(trip => ({
          id: trip.id,
          confirmationId: trip.confirmation_id,
          destination: trip.destination,
          duration: trip.duration,
          selectedCampgrounds: trip.campgrounds,
          createdAt: trip.created_at,
          status: trip.status,
          guideUrl: trip.guide_url
        })) : []
      };
      
      console.log('✅ authService: Login process completed successfully');
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
      console.log('Starting Supabase signout process...');
      
      // Try both local and global signout to ensure complete logout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Supabase signout error:', error);
        throw error;
      }
      
      console.log('Supabase signout completed successfully');
      
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