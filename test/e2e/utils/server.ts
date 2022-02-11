import { bootstrapApp, BootstrapSettings } from './bootstrap';

let settings: BootstrapSettings;
export const prepareServer = async () => {
    settings = await bootstrapApp();
    return settings;
};

export const shutdownServer = async () => {
    if (settings) {
        settings.framework.shutdown();
    }
};
