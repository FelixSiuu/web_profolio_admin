import { coreSkillsService, skillDto } from '@/services/myInfo.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useSkillsHooks() {
  const queryClient = useQueryClient()

  // 🎯 1. 獲取數據 (Read)
  const {
    data = [], // 預設空陣列，對齊原本的 useState 初始值
    isLoading
  } = useQuery({
    queryKey: ['getCoreSkills'],
    queryFn: async () => {
      const { isSuccess, data, message } = await coreSkillsService.getCoreSkills()
      if (!isSuccess) throw new Error(message)
      return data
    }
  })

  // 🎯 2. 執行添加 (Create)
  const { mutateAsync: addCoreSkill, isPending: isAddLoading } = useMutation({
    mutationFn: async (postBody: skillDto) => {
      const { isSuccess, message } = await coreSkillsService.addCoreSkill(postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      // 🔥 關鍵：通知這把鑰匙的快取失效，Table 會在背景無感自動重新撈取最新數據
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 3. 執行編輯 (Update)
  const { mutateAsync: editCoreSkill, isPending: isEditLoading } = useMutation({
    mutationFn: async ({ id, postBody }: { id: number; postBody: skillDto }) => {
      const { isSuccess, message } = await coreSkillsService.editCoreSkill(id, postBody)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 4. 執行刪除 (Delete)
  const { mutateAsync: deleteCoreSkill, isPending: isDeleteLoading } = useMutation({
    mutationFn: async (id: number) => {
      const { isSuccess, message } = await coreSkillsService.deleteCoreSkill(id)
      if (!isSuccess) throw new Error(message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCoreSkills'] })
    }
  })

  // 🎯 5. 整合原本的 Loading 狀態，確保外部引用的變數名稱不變
  const confirmLoading = isAddLoading || isEditLoading || isDeleteLoading

  return {
    data,
    confirmLoading,
    isLoading,
    deleteCoreSkill,
    editCoreSkill,
    addCoreSkill
  }
}
