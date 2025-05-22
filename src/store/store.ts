import { Record } from '@/models/record'
import { create } from 'zustand'


type State = {
  records: Record[]
  setRecords: (records: Record[]) => void
}

export const useRecordStore = create<State>((set) => ({
  records: [],
  setRecords: (records) => set({ records }),
}))
