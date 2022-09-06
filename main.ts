import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting } from 'obsidian';

interface YonotePluginSettings {
	api_key: string;
}

const DEFAULT_SETTINGS: YonotePluginSettings = {
	api_key: ''
}

export default class YonotePlugin extends Plugin {
	settings: YonotePluginSettings;

	async onload() {
		await this.loadSettings();

		const statusBarItemEl = this.addStatusBarItem()
		statusBarItemEl.setText('🗒️');
        statusBarItemEl.onClickEvent(evt => {
            //new Notice('This is a notice!');

            this.loadYo();
        });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

    async loadYo() {
        const headers = {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: 'Bearer '+ this.settings.api_key }
            
        const data = await requestUrl({url: "https://app.yonote.ru/api/documents.list", headers})
        console.log(data);
    }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: YonotePlugin;

	constructor(app: App, plugin: YonotePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Yonote'});

		new Setting(containerEl)
			.setName('API key')
			.setDesc('ITS NOT A PRIVATE')
			.addText(text => text
				.setPlaceholder('Enter api key')
				.setValue(this.plugin.settings.api_key)
				.onChange(async (value) => {
					this.plugin.settings.api_key = value;
					await this.plugin.saveSettings();
				}));
	}
}
