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
   *  執行添加
   */
  const { mutateAsync: addWorkingExp, isPending: isAddLoading } = useMutation({
    mutationFn: (postBody: WorkingExpDto) => workingExpService.addWorkingExp(postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  /**
   *  執行編輯
   */
  const { mutateAsync: editWorkingExp, isPending: isEditLoading } = useMutation({
    mutationFn: ({ id, postBody }: { id: number; postBody: WorkingExpDto }) => workingExpService.editWorkingExp(id, postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteWorkingExp } = useMutation({
    mutationFn: (id: number) => workingExpService.deleteWorkingExp(id),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getWorkingExp'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading

  return {
    data,
    confirmLoading,
    isLoading,
    deleteWorkingExp,
    editWorkingExp,
    addWorkingExp
  }
}
