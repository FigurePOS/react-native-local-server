import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialIconsGlyphs from "react-native-vector-icons/glyphmaps/MaterialIcons.json"
import { mapObjIndexed } from "ramda"

type names = keyof typeof MaterialIconsGlyphs

export const IconNames: Record<names, string> = mapObjIndexed((_value, key) => key, MaterialIconsGlyphs)

export const Icon = MaterialIcons
