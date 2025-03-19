"use client";
import Form from "next/form";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import createRoom from "../../serverActions/createRoom";
import ToastMessage from "../../components/ToastMessage";
import { useState } from "react";
import searchRoom from "../../serverActions/searchRoom";
import { userSchema } from "@repo/common/types";
import { useRouter } from "next/navigation";

interface IFormError {
  formErrors: string[];
  fieldErrors: { slug?: string[] };
}

export default function dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<IFormError | null>();
  const RoomSearchSchema = userSchema.omit({
    email: true,
    password: true,
    username: true,
  });

  async function handleJoin(formData: FormData) {
    console.log("Handle Join");
    const slug = formData.get("slug");

    const { error, success, data } = RoomSearchSchema.safeParse({ slug });

    if (error || !success) {
      setFormError(error.formErrors);
      return;
    }
    setFormError(null);

    if (!slug) {
      setMessage("Room Name not given!!");
      setSuccess(false);
      return;
    }

    const exists = await searchRoom(slug as string);

    if (!exists.success) {
      setSuccess(false);
      setMessage(exists.message);
      return;
    }

    setSuccess(true);
    setMessage("Joining...");
    router.push(`/canvas/${exists.roomId}`);
  }

  async function handleCreate(formData: FormData) {
    console.log("Handle Create");
    const slug = formData.get("slug");
    const token = localStorage.getItem("token");

    const { error, success, data } = RoomSearchSchema.safeParse({ slug });

    if (error || !success) {
      setFormError(error.formErrors);
      return;
    }
    setFormError(null);

    if (!slug) {
      setMessage("Room Name not given!!");
      setSuccess(false);
      return;
    }

    if (!token) {
      setMessage("Token Error: SignIn again!!");
      setSuccess(false);
      return;
    }

    const response = await createRoom(slug as string, token);

    if (!response.success) {
      setSuccess(false);
      setMessage(response.message);
      return;
    }

    setSuccess(true);
    setMessage(response.message);
  }
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-100">
      <div className="shadow max-w-[370px] m-2 bg-white rounded-md">
        <Form action={handleJoin}>
          <Input
            placeholder="Room Name"
            type="text"
            name="slug"
            autoComplete="username"
          />
          {formError?.fieldErrors?.slug && (
            <div className="text-red-600">{formError?.fieldErrors.slug}</div>
          )}
          <Button value="Join Room" />
          <Button value="Create Room" formAction={handleCreate} />
          {message && <ToastMessage message={message} success={success} />}
        </Form>
      </div>
    </div>
  );
}
