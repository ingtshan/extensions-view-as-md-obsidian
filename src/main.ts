import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface FileViewRulePluginSettings {
	markdownExtensionsText: string;
}

const DEFAULT_SETTINGS: FileViewRulePluginSettings = {
	markdownExtensionsText: 'txt'
}

export default class FileViewRulePlugin extends Plugin {
	settings: FileViewRulePluginSettings;

	async onload() {
		super.onload();

		await this.loadSettings();

		this.registerExtensions(this.settings.markdownExtensionsText.split(';'), "markdown");

		this.addSettingTab(new FileViewRulePluginSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class FileViewRulePluginSettingTab extends PluginSettingTab {
	plugin: FileViewRulePlugin;

	constructor(app: App, plugin: FileViewRulePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'File View Rule'});

		new Setting(containerEl)
			.setName('Extensions view as Markdown')
			.setDesc('separate by ; and restart to take effect!')
			.addText(text => text
			.setPlaceholder('Enter extensions')
			.setValue(this.plugin.settings.markdownExtensionsText)
			.onChange(async (value) => {
				this.plugin.settings.markdownExtensionsText = value;
				await this.plugin.saveSettings();
			}));
	}
}
