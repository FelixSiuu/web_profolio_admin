import { educationService, EduDto } from '@/services/myInfo.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useEducationHooks() {
  const queryClient = useQueryClient()

  /**
   * 獲取數據
   */
  const { data = [], isLoading } = useQuery({
    queryKey: ['getEducation'],
    queryFn: async () => {
      const { isSuccess, data, message } = await educationService.getEducation()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  /**
   * 執行添加
   */
  const { mutateAsync: addEducation, isPending: isAddLoading } = useMutation({
    mutationFn: async (postBody: EduDto) => {
      const { isSuccess, message } = await educationService.addEducation(postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  /**
   * 執行編輯
   */
  const { mutateAsync: editEducation, isPending: isEditLoading } = useMutation({
    mutationFn: async ({ id, postBody }: { id: number; postBody: EduDto }) => {
      const { isSuccess, message } = await educationService.editEducation(id, postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteEducation, isPending: isDeleteLoading } = useMutation({
    mutationFn: async (id: number) => {
      const { isSuccess, message } = await educationService.deleteEducation(id)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading || isDeleteLoading

  return { data, isLoading, confirmLoading, addEducation, editEducation, deleteEducation }
}
