import { endpoint } from '~/plugins/aws'
import * as Auth from '@aws-amplify/auth'
import { mande } from 'mande'

export const useMande = async () => {
  const session = await Auth.fetchAuthSession()

  const api = mande(endpoint)

  if (!session.tokens) {
    throw new Error('Auth state token not found')
  }

  api.options.headers.Authorization = 'Bearer ' + session.tokens!.idToken?.toString()

  return api
}