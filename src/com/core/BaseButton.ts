import GButton = fgui.GButton
import {ActionEvent, StringBlock, ViewBlock} from "../block/Block"

export class BaseButton extends mixinExt(StringBlock, ViewBlock, ActionEvent, GButton) {}