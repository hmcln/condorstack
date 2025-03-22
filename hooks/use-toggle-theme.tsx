import * as React from "react"
import { useTheme } from "next-themes"

import { META_THEME_COLORS } from "@/config/site"
import { useMetaColor } from "@/hooks/use-meta-color"

export function useToggleTheme() {
    const { setTheme, resolvedTheme } = useTheme()
    const { setMetaColor } = useMetaColor()


    return React.useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
        setMetaColor(
            resolvedTheme === "dark"
                ? META_THEME_COLORS.light
                : META_THEME_COLORS.dark
        )
    }, [resolvedTheme, setTheme, setMetaColor])
}

