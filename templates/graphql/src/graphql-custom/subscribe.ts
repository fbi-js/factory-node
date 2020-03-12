import { subscriptionField } from 'nexus'

export const userCreated = subscriptionField('userCreated', {
  type: 'User',
  subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator('USER_CREATED'),
  resolve: payload => payload
})
