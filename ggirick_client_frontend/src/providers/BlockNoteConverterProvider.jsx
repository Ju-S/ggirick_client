import React, { createContext, useContext, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";

const BlockNoteConverterContext = createContext(null);

export function BlockNoteConverterProvider({ children }) {
    const editor = useCreateBlockNote({
        initialContent: [{ type: "paragraph", content: [] }],
    });

    const convertBlocksToHTML = useMemo(() => {
        return async (blocks) => {
            if (!editor) return "<p>변환 불가</p>";
            try {
                const html = editor.blocksToFullHTML(blocks);
                return html;
            } catch (err) {
                console.warn("blocksToFullHTML 실패, blocksToHTMLLossy로 폴백:", err);
                try {
                    const html = editor.blocksToHTMLLossy(blocks);
                    return html;
                } catch (err2) {
                    console.error("blocksToHTMLLossy도 실패:", err2);
                    const plain = (blocks || [])
                        .map((b) =>
                            (b.content || [])
                                .map((i) => (i.text ? i.text : ""))
                                .join("")
                        )
                        .join("\n");
                    return `<pre>${escapeHtml(plain)}</pre>`;
                }
            }
        };
    }, [editor]);

    return (
        <BlockNoteConverterContext.Provider value={{ convertBlocksToHTML }}>
            {children}
        </BlockNoteConverterContext.Provider>
    );
}

export function useBlockNoteConverter() {
    const ctx = useContext(BlockNoteConverterContext);
    if (!ctx) throw new Error("useBlockNoteConverter must be used within Provider");
    return ctx;
}

function escapeHtml(str = "") {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
