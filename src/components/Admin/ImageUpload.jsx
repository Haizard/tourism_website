/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { compressImageFile } from "./imageUtils";

const ImageUpload = ({
  value,
  onChange,
  label,
  required = false,
  multiple = false,
  placeholder = "Or paste an image URL",
}) => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = async (fileList) => {
    setError("");
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    try {
      const results = [];
      for (const file of fileList) {
        const res = await compressImageFile(file);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        results.push(res.dataUrl);
      }
      if (multiple) {
        onChange([...(Array.isArray(value) ? value : []), ...results]);
      } else {
        onChange(results[0]);
      }
    } catch (e) {
      setError("Failed to process image. Please try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (index) => {
    const list = Array.isArray(value) ? value : [];
    onChange(list.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-medium";

  const renderSingle = () => (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-xl shadow-md"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black hover:bg-red-600 transition"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {busy ? "Processing..." : "Upload Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );

  const renderMultiple = () => {
    const list = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {list.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {list.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
              >
                <img
                  src={src}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove image ${i + 1}`}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black opacity-0 group-hover:opacity-100 transition"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {busy ? "Processing..." : "Upload Images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <textarea
          value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={placeholder}
          rows={3}
          className={inputClass}
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
          {label}
        </label>
      )}
      {multiple ? renderMultiple() : renderSingle()}
      {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
