import GLabel = fgui.GLabel;
import {ActionEvent, ViewBlock} from "../block/Block"

export class BaseLabel extends mixinExt(ViewBlock, ActionEvent, GLabel) {}