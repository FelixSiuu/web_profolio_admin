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
   *  執行添加
   */
  const { mutateAsync: addEducation, isPending: isAddLoading } = useMutation({
    mutationFn: (postBody: EduDto) => educationService.addEducation(postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  /**
   *  執行編輯
   */
  const { mutateAsync: editEducation, isPending: isEditLoading } = useMutation({
    mutationFn: ({ id, postBody }: { id: number; postBody: EduDto }) => educationService.editEducation(id, postBody),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  /**
   * 執行刪除
   */
  const { mutateAsync: deleteEducation, isPending: isDeleteLoading } = useMutation({
    mutationFn: (id: number) => educationService.deleteEducation(id),
    onSuccess: (res) => {
      if (!res.isSuccess) throw new Error(res.message)
      queryClient.invalidateQueries({ queryKey: ['getEducation'] })
    }
  })

  const confirmLoading = isAddLoading || isEditLoading || isDeleteLoading

  return { data, isLoading, confirmLoading, addEducation, editEducation, deleteEducation }
}
