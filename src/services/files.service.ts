import type { UploadFile } from 'element-plus'

class FilesService {
  async uploadRecipeImage (data: UploadFile) {
    if (!data.raw) {
      return
    }

    const storage = useSupabase.storage.from('recipe-images')

    const timestamp = Date.now()
    const fileName = `recipe-images-${timestamp}`

    const { data: uploadedFile, error } = await storage.upload(fileName, data.raw)

    if (error || !uploadedFile) {
      throw new Error('Failed to upload image')
    }

    const productUrl = await storage.getPublicUrl(uploadedFile.path).data.publicUrl

    return { productUrl }
  }
}

export const filesService = new FilesService()
