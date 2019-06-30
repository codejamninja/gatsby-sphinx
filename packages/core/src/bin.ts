import Err from 'err';
import commander from 'commander';
import ora from 'ora';
import action from './action';
import handleError from './handleError';
import { Dependancies, Options } from './types';
import { createConfig } from './config';

let isAction = false;
const dependancies: Dependancies = { spinner: ora() };

try {
  commander.command('build');
  commander.command('clean');
  commander.command('start');
  commander.option('--config [json]', 'config json');
  commander.option('-d --debug', 'debug logging');
  commander.option('-v --verbose', 'verbose logging');
  commander.action(async (cmd: string, options: Options) => {
    isAction = true;
    const config = createConfig(cmd, options);
    return action(config, dependancies).catch((err: Error) => {
      return handleError(err, dependancies);
    });
  });
  commander.parse(process.argv);
} catch (err) {
  handleError(err, dependancies);
}

if (!isAction) {
  handleError(new Err('action not specified', 400), dependancies);
}
