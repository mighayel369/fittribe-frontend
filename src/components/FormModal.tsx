import React, { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { FaCloudUploadAlt } from "react-icons/fa";
import SubmitButton from "./SubmitButton";
import {type FormField } from "../types/formFieldType";

interface Props<T> {
  heading: string;
  fields: FormField[];
  onClose: () => void;
  onSubmit: (values: T) => void;
  buttonText:string,
  loading?: boolean;
}

const FormModal = <T extends Record<string, any>>({ heading, fields, onClose, onSubmit,buttonText, loading }: Props<T>) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initateState: Record<string, any> = {}
    fields.map((f: FormField) => {
      initateState[f.name] = f.type === 'file' ? null : ''
    })
    return initateState
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as T)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{heading}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <HiOutlineX size={24} />
          </button>
        </div>

        <form onSubmit={handleInternalSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((f: FormField) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
              {
                f.type === 'textarea' ? (
                  <textarea
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 bg-gray-50 resize-none"
                    value={formData[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <select
                    required={f.required}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                    value={formData[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  >
                    <option value="" disabled>{f.placeholder || "Select an option"}</option>
                    {f.options?.map((opt)=>(
                        <option key={opt.value} value={opt.value} >{opt.label}</option>
                    ))}
                  </select>
                ):f.type==='file'?(
                  <div className="relative border-2 dashed-border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-emerald-50 transition-colors group">
                    <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleChange(f.name, e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-emerald-600">
                    <FaCloudUploadAlt size={24} />
                    <span className="text-xs font-medium mt-1">
                      {formData[f.name] ? (formData[f.name] as File).name:"Upload Document"}
                    </span>
                  </div>
                  </div>
                ):(
                  <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 bg-gray-50 text-sm"
                  value={formData[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
                )
          }
            </div>
          ))}
          <SubmitButton text={buttonText} loading={loading}/>
        </form>

      </div>
    </div>
  );
};

export default FormModal;