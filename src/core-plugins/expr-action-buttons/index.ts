import { PluginID } from "../../plugins";
import { Inserter, PluginController } from "../../plugins/PluginController";
import { ActionButtons } from "./components/ActionButtons";
import { ItemModel } from "#globals";

export default class ExprActionButtons extends PluginController<undefined> {
  static id = "expr-action-buttons" as const;
  static enabledByDefault = true;
  static isCore = true;

  beforeDisable() {
    throw new Error(
      "Programming Error: core plugin Expression Action Buttons should not be disableable"
    );
  }

  actionButtonsView(m: ItemModel): Inserter {
    return () => ActionButtons(this, m);
  }

  order() {
    const enabled = Object.keys(this.dsm.enabledPlugins) as PluginID[];
    enabled.sort();
    return enabled.flatMap((pluginID: string | number) =>
      (this.dsm.enabledPlugins[pluginID]!.actionButtons ?? []).map(
        (eab: ActionButtonWithKey, i: any): ActionButtonWithKey => ({
          ...eab,
          key: `${pluginID}:${i}`,
        })
      )
    );
  }
}

export interface ActionButton {
  tooltip: string;
  buttonClass: string;
  iconClass: string;
  predicate: (m: ItemModel) => boolean;
  onTap: (m: ItemModel) => void;
}

interface ActionButtonWithKey extends ActionButton {
  key: string;
}
