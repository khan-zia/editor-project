/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { NotesResponse, NoteResponse } from '../../../backend/routes/notes';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';

interface ServerRequest {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;

  /**
   * Executes the prepared server requests upon call. Resolves to a generic promise.
   * Type-hint (assert) the return Promise type as required. It will attempt to resolve the
   * promise on server response of 2xx.
   */
  executeRequest: <T>(data?: { [field: string]: unknown } | null) => Promise<T | void>;

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

export const useServerRequest = (method: 'get' | 'post' | 'put' | 'delete', url: string): ServerRequest => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortController = useRef<AbortController | undefined>(undefined);

  const executeRequest: ServerRequest['executeRequest'] = async (data = null) => {
    setIsLoading(true);

    try {
      abortController.current = new AbortController();

      const res = await fetch(url, {
        method,
        ...(data && {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
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

export const useNote = (id: string) => {
  const { readyState, lastMessage, sendMessage } = useWebSocket(`ws://localhost:3001/api/notes/${id}`);

  // Send a message when ready on first load
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('');
    }
  }, [readyState, lastMessage]);

  return {
    note: lastMessage && (JSON.parse(lastMessage.data) as NoteResponse),
    readyState,
  };
};
