import { WorkingExpDto, workingExpService } from '@/services/myInfo.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useExperienceHooks() {
  const queryClient = useQueryClient()

  /**
   * 獲取數據
   */
  const { data = [], isLoading } = useQuery({
    queryKey: ['getWorkingExp'],
    queryFn: async () => {
      const { isSuccess, data, message } = await workingExpService.getWorkingExp()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  /**
   * 執行添加
   */
  const { mutateAsync: addWorkingExp, isPending: isAddLoading } = useMutation({
    mutationFn: async (postBody: WorkingExpDto) => {
      const { isSuccess, message } = await workingExpService.addWorkingExp(postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  /**
   * 執行編輯
   */
  const { mutateAsync: editWorkingExp, isPending: isEditLoading } = useMutation({
    mutationFn: async ({ id, postBody }: { id: number; postBody: WorkingExpDto }) => {
      const { isSuccess, message } = await workingExpService.editWorkingExp(id, postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteWorkingExp, isPending: isDeleteLoading } = useMutation({
    mutationFn: async (id: number) => {
      const { isSuccess, message } = await workingExpService.deleteWorkingExp(id)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading || isDeleteLoading

  return {
    data,
    confirmLoading,
    isLoading,
    deleteWorkingExp,
    editWorkingExp,
    addWorkingExp
  }
}
