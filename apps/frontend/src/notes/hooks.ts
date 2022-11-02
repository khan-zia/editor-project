/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { NotesResponse } from '../../../backend/routes/notes';

interface ServerRequest {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;

  /**
   * Executes the prepared server requests upon call. Resolves to a generic promise.
   * Type-hint (assert) the return Promise type as required. It will attempt to resolve the
   * promise on server response of 2xx.
   */
  executeRequest: <T>(data?: { [field: string]: unknown } | FormData | null) => Promise<T | void>;

  /**
   * Reset internal state of the Request.
   *
   * Resets:
   * isLoading = false
   * isSuccess = false
   * isError = false
   */
  reset: () => void;

  /**
   * Abort the ongoing request.
   */
  abort: () => void;
}

// If you want to use GraphQL API or libs like Axios, you can create your own fetcher function.
// Check here for more examples: https://swr.vercel.app/docs/data-fetching
const fetcher = async (input: RequestInfo, init: RequestInit) => {
  const res = await fetch(input, init);
  return res.json();
};

/**
 * Simple hook to make a server request. Exposes helper methods such as "abort" and "reset" and
 * request status.
 *
 * @param method Request method.
 * @param url URL relative to server's base. Without leading slash '/'.
 */
export const useServerRequest = (method: 'get' | 'post' | 'put' | 'delete', url: string): ServerRequest => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortController = useRef<AbortController | undefined>(undefined);

  const executeRequest: ServerRequest['executeRequest'] = async (data = null) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      abortController.current = new AbortController();

      /**
       * Todo: Base URL would typically come from an env.
       * 1. If data is defined, add it to the request.
       * 2. If data is FormData then append it directly otherwise stringify it.
       * 3. If data is not FormData then also add "application/json" header.
       */
      const res = await fetch(`http://localhost:3001/${url}`, {
        method,
        ...(data && {
          body: data instanceof FormData ? (data as FormData) : JSON.stringify(data),
          ...(!(data instanceof FormData) && {
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        }),
        signal: abortController.current.signal,
      });

      if (!res.ok) {
        setIsError(true);
      } else {
        setIsSuccess(true);
      }

      return res.json();
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
  };

  const abort = () => abortController.current?.abort();

  return {
    executeRequest,
    isLoading,
    isSuccess,
    isError,
    reset,
    abort,
  };
};

export const useNotesList = () => {
  const { data, error } = useSWR<NotesResponse>('http://localhost:3001/api/notes', fetcher);

  return {
    notesList: data?.notes,
    isLoading: !error && !data,
    isError: error,
  };
};

/**
 * Initialize a websocket connection with referential integrity. Component re-renders will not cause
 * multiple connections.
 *
 * @param url The websocket server URL. Defaults to "ws://localhost:3001"
 */
export const useSocket = (url?: string, options?: Partial<ManagerOptions & SocketOptions> | undefined): Socket => {
  // Todo: Base socket server URL would typically come from an env.
  const { current: socket } = useRef(
    io(url || 'ws://localhost:3001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
      ...options,
    }),
  );

  // Close socket if the component unmounts.
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return socket;
};
