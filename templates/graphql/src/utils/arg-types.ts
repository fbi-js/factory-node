import { arg, core } from 'nexus'

export const dateTimeArg = (opts: core.NexusArgConfig<'DateTime'>) =>
  arg({ ...opts, type: 'DateTime' })
