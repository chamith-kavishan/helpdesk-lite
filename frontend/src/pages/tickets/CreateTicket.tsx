import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

import { axiosClient } from "../../api/axiosClient";
import { CUSTOM_SELECT_STYLES, PRIORITY_OPTIONS } from "../../utils/constants";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { toast } from "react-toastify";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

type Form = z.infer<typeof schema>;

export default function CreateTicket() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "LOW" },
  });

  const onSubmit = async (data: Form) => {
    const { isConfirmed } = await Swal.fire({
      title: "Create this ticket?",
      text: "Please confirm you want to submit the ticket.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      focusCancel: true,
    });

    if (!isConfirmed) return;

    try {
      await axiosClient.post("/tickets", data);
      toast.success("Your ticket has been submitted.");
      nav("/");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="pt-6">
      <div className="flex items-center w-full justify-between">
        <h2 className="main-label">New Ticket</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 md:mt-8 space-y-8"
      >
        <div>
          <label htmlFor="title" className="input-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="primary-input"
            placeholder="Brief, clear subject"
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="input-label">
            Description
          </label>
          <textarea
            id="description"
            className="primary-input min-h-[200px]"
            placeholder="Describe the issue clearly to help faster resolution"
            {...register("description")}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p id="description-error" className="text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="input-label">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                className="mt-3"
                classNamePrefix="select"
                isSearchable
                isClearable={false}
                placeholder="Priority"
                styles={CUSTOM_SELECT_STYLES}
                options={
                  PRIORITY_OPTIONS as unknown as {
                    value: Form["priority"];
                    label: string;
                  }[]
                }
                value={
                  PRIORITY_OPTIONS.find((o) => o.value === field.value) || null
                }
                onChange={(opt) =>
                  field.onChange((opt as { value: Form["priority"] }).value)
                }
                onBlur={field.onBlur}
                inputId="priority"
              />
            )}
          />
          {errors.priority && (
            <p className="text-destructive mt-1">{errors.priority.message}</p>
          )}
        </div>

        <div className="w-full flex justify-end">
          <div className="flex items-center gap-8">
            <PrimaryButton name="Submit" submitting={isSubmitting} />
            <SecondaryButton name="Cancel" onClick={() => nav("/")} />
          </div>
        </div>
      </form>
    </section>
  );
}
