import { analyzeBoxPhoto } from "@/features/boxes/services/analyze-box-photo-service";
import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

const MAX_BYTES = 8 * 1024 * 1024;

export const POST = withApi(async (request) => {
  const formData = await request.formData().catch(() => null);
  if (!formData) throw badRequest("Expected multipart/form-data body");

  const photo = formData.get("photo");
  if (!(photo instanceof File)) throw badRequest("Missing 'photo' file field");
  if (!photo.type.startsWith("image/")) throw badRequest("'photo' must be an image");
  if (photo.size > MAX_BYTES) throw badRequest("'photo' must be 8MB or smaller");

  const buffer = Buffer.from(await photo.arrayBuffer());
  return analyzeBoxPhoto({
    data: buffer.toString("base64"),
    mimeType: photo.type,
  });
});
