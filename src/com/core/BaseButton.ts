import GButton = fgui.GButton
import {ActionEvent, StringBlock, ViewBlock} from "../Factory"

export class BaseButton extends mixinExt(StringBlock, ViewBlock, ActionEvent, GButton) {}