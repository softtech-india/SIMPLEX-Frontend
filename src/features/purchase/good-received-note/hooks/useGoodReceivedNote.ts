import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goodReceivedNoteService } from '../services/goodReceivedNoteService';
import { ConfirmGRNApiReponse, GoodReceivedNoteFormType } from '../types/goodReceivedNote.types';
import { toast } from 'sonner';

export interface GetGoodReceivedNoteParams {
  userid: number;
  compid: number;
  skip?: number;
  take?: number;
  branchid?: number;
  finid?: number;
  startdt?: string;
  enddt?: string;
}

type GetGoodReceivedNoteByIdParams = {
  id?: number;
  userid: number;
  compid: number;
  branchid: number | string;
  finid: number;
};

export const GOOD_RECEIVED_NOTE_KEY = {
  all: ["good-received-note"] as const,

  lists: () => [...GOOD_RECEIVED_NOTE_KEY.all, "list"] as const,

  list: (params?: Record<string, any>) =>
    [...GOOD_RECEIVED_NOTE_KEY.lists(), params ?? {}] as const,

  details: () => [...GOOD_RECEIVED_NOTE_KEY.all, "detail"] as const,

  detail: (id: number) =>
    [...GOOD_RECEIVED_NOTE_KEY.details(), id] as const,
};

export function useGoodReceivedNoteList(
  params: GetGoodReceivedNoteParams
) {
  return useQuery({
    queryKey: GOOD_RECEIVED_NOTE_KEY.list(params),

    queryFn: () =>
      goodReceivedNoteService.getAllGoodReceivedNote(params),

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGoodReceivedNoteById(
  params: GetGoodReceivedNoteByIdParams
) {
  return useQuery({
    queryKey: GOOD_RECEIVED_NOTE_KEY.detail(params.id ?? 0),

    queryFn: () =>
      goodReceivedNoteService.getGoodReceivedNoteById({
        id: params.id!,
        userid: params.userid,
        compid: params.compid,
        branchid: params.branchid,
        finid: params.finid,
      }),

    enabled: !!params.id, // only run when id exists

    staleTime: 0,
    gcTime: 0,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCreateGoodReceivedNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GoodReceivedNoteFormType) =>
      goodReceivedNoteService.createGoodReceivedNote(data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GOOD_RECEIVED_NOTE_KEY.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to create Good Received Note");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error creating Good Received Note");
    },
  });
}


export function useCreateConfirmGrn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      goodReceivedNoteService.createConfirmGrn(data),

    onSuccess: (data: ConfirmGRNApiReponse) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GOOD_RECEIVED_NOTE_KEY.list() });
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to Confirm Good Received Note");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Error Confirm Good Received Note");
    },
  });
}


export function useUpdateGoodReceivedNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GoodReceivedNoteFormType }) =>
      goodReceivedNoteService.updateGoodReceivedNote(id, data),

    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GOOD_RECEIVED_NOTE_KEY.list() });
        queryClient.invalidateQueries({ queryKey: GOOD_RECEIVED_NOTE_KEY.details() });

        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update Good Received Note");
      }
    },

    onError: (err: Error) => {
      toast.error(err.message || "Failed to update Good Received Note");
    },
  });
}

export function useDeleteGoodReceivedNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: number;
      userid: number;
      compid: number;
      branchid: number | string;
      finid: number;
    }) => goodReceivedNoteService.deleteGoodReceivedNote(params),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: GOOD_RECEIVED_NOTE_KEY.list(),
      });

      toast.success(data?.message || "Deleted successfully");
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete Good Received Note");
    },
  });
}