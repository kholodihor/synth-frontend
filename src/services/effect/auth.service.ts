import * as Effect from 'effect/Effect';
import * as Context from 'effect/Context';
import * as Layer from 'effect/Layer';
import axios from 'axios';
import { useProfileStore } from '@/stores/profileStore';
import { useSongStore } from '@/stores/songStore';
import { useVideoStore } from '@/stores/videoStore';
import { useBandsStore } from '@/stores/bandsStore';

// Define error types
export class AuthError {
  readonly _tag = 'AuthError';
  constructor(
    public message: string,
    public field?: string,
    public status?: number
  ) { }
}

export class NetworkError {
  readonly _tag = 'NetworkError';
  constructor(public message: string) { }
}

// Define the auth response type
export interface AuthResponse {
  token: string;
  userId: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

// Define the service interface
export interface AuthService {
  login: (email: string, password: string) => Effect.Effect<AuthResponse, AuthError | NetworkError, never>;
  register: (username: string, email: string, password: string) => Effect.Effect<AuthResponse, AuthError | NetworkError, never>;
  fetchUserData: () => Effect.Effect<void, Error, never>;
}

// Create a tag for the service
export const AuthService = Context.GenericTag<AuthService>('AuthService');

// Type guard for AuthError
const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof AuthError || (error as AuthError)?._tag === 'AuthError';
};

// Type guard for NetworkError
const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError || (error as NetworkError)?._tag === 'NetworkError';
};

// Implementation of the service
export const AuthServiceImpl = AuthService.of({
  login: (email: string, password: string) =>
    Effect.tryPromise<AuthResponse, AuthError | NetworkError>({
      try: async () => {
        console.log('Attempting login with email:', email);
        const response = await axios.post('/api/user/login', {
          email: email.trim().toLowerCase(),
          password
        });

        console.log('Login response:', response.data);
        const data = response.data;

        if (!data) {
          console.error('No data in login response');
          throw new AuthError('Invalid response from server');
        }

        if (!data.token) {
          console.error('No token in response:', data);
          throw new AuthError('No authentication token received');
        }

        // Get user ID from the root level _id field
        const userId = data._id;
        if (!userId) {
          console.error('No user ID (_id) found in response:', data);
          throw new AuthError('No user ID received in response');
        }

        console.log('Login successful for user ID:', userId);
        return {
          token: data.token,
          userId,
          user: {
            _id: userId,
            username: data.username || '',
            email: data.email || email
          }
        };
      },
      catch: (error: unknown) => {
        if (isAuthError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
            field?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;

          if (data?.field) {
            return new AuthError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new AuthError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    }),

  register: (username: string, email: string, password: string) =>
    Effect.tryPromise<AuthResponse, AuthError | NetworkError>({
      try: async () => {
        console.log('Attempting registration with email:', email);
        const response = await axios.post('/api/user/register', {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password
        });

        console.log('Registration response:', response.data);
        const data = response.data;

        if (!data) {
          console.error('No data in registration response');
          throw new AuthError('Invalid response from server');
        }

        if (!data.token) {
          console.error('No token in response:', data);
          throw new AuthError('No authentication token received');
        }

        // Get user ID from the root level _id field
        const userId = data._id;
        if (!userId) {
          console.error('No user ID (_id) found in response:', data);
          throw new AuthError('No user ID received in response');
        }

        console.log('Registration successful for user ID:', userId);
        return {
          token: data.token,
          userId,
          user: {
            _id: userId,
            username: data.username || username,
            email: data.email || email
          }
        };
      },
      catch: (error: unknown) => {
        if (isAuthError(error) || isNetworkError(error)) {
          return error;
        }

        if (axios.isAxiosError(error)) {
          const response = error.response;
          const data = response?.data as {
            message?: string;
            error?: string;
            field?: string;
          } | undefined;

          // Handle error message from response
          const errorMessage = data?.error || data?.message || error.message;

          if (data?.field) {
            return new AuthError(
              errorMessage,
              data.field,
              response?.status
            );
          }

          return new AuthError(
            errorMessage,
            undefined,
            response?.status
          );
        }

        if (error instanceof Error) {
          return new NetworkError(error.message);
        }

        return new NetworkError('An unknown error occurred');
      }
    }),

  fetchUserData: () =>
    Effect.tryPromise<void, Error>({
      try: async () => {
        await Promise.all([
          useProfileStore().fetchProfileById(),
          useSongStore().fetchSongsByUserId(),
          useBandsStore().fetchBandsByUserId(),
          useVideoStore().fetchVideosByUserId()
        ]);
      },
      catch: (error: unknown) => {
        if (error instanceof Error) {
          return error;
        }
        return new Error('Failed to fetch user data');
      }
    })
});

// Create a layer for the service
export const AuthServiceLayer = Layer.succeed(AuthService, AuthServiceImpl);

// Define the result type for auth effects
export interface AuthEffectResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    field?: string;
    status?: number;
  };
}

// Helper function to run effects with proper error handling
export const runAuthEffect = <T>(
  effect: Effect.Effect<T, AuthError | NetworkError | Error, AuthService | never>
): Promise<AuthEffectResult<T>> => {
  // Provide the service implementation and run the effect
  const program = Effect.provideService(AuthService, AuthServiceImpl)(effect);

  // Run the effect and handle the result
  return Effect.runPromise(
    Effect.match(program, {
      onSuccess: (data) => ({
        success: true as const,
        data
      }),
      onFailure: (error) => ({
        success: false as const,
        error: isAuthError(error)
          ? {
            message: error.message,
            field: error.field,
            status: error.status
          }
          : {
            message: error instanceof Error ? error.message : 'An unknown error occurred'
          }
      })
    })
  );
};
