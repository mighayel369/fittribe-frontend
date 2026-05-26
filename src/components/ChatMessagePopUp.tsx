import {
    BsImage,
    BsCameraVideo,
    BsFilePdf
} from 'react-icons/bs';

interface RenderMessageProps {
    message: {
        type: string;
        content?: string;
        file?: {
            url: string;
            mimeType:string;
            size: number;
            name: string
        };
    };
}

export const MessagePopUp = ({ message }: RenderMessageProps) => {
    const hasFile = !!message.file?.url;
    const hasContent = !!message.content && message.content.trim().length > 0;

    return (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate max-w-full">
            {hasFile ? (
                <>
                    {(message.type === "image" || message.file?.mimeType?.startsWith("image/")) && (
                        <span className="flex items-center gap-1 shrink-0 font-medium text-emerald-600">
                            <BsImage size={13} />
                            <span>{message.content || "photo"}</span>
                        </span>
                    )}

                    {(message.type === "video" || message.file?.mimeType?.startsWith("video/")) && (
                        <span className="flex items-center gap-1 shrink-0 font-medium text-indigo-600">
                            <BsCameraVideo size={13} />
                            <span>{message.content || "video"}</span>
                        </span>
                    )}

                    {(message.type === "raw" || message.type === "pdf" || message.file?.mimeType?.includes("pdf")) && (
                        <span className="flex items-center gap-1 shrink-0 font-medium text-red-500">
                            <BsFilePdf size={13} />
                            <span className="max-w-[100px] truncate">{message.content || message.file?.name}</span>
                        </span>
                    )}

                    {hasContent && (
                        <span className="text-slate-400 font-normal">: {message.content}</span>
                    )}
                </>
            ) : (
                <span className="truncate">{message.content || ""}</span>
            )}
        </div>
    );
};