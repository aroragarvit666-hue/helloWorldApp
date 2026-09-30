import React, { useState } from 'react'
import {
  Provider,
  defaultTheme,
  View,
  Flex,
  Heading,
  Content,
  TextField,
  Button,
  Well,
  InlineAlert,
  ProgressCircle,
} from '@adobe/react-spectrum'
import actions from '../config.json'

export default function App({ runtime, ims }) {
  // Do NOT call runtime.done() here — index.js calls it in the ready handler.
  const helloUrl = actions['hello'] // exact action name from app.config.yaml

  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function sayHello() {
    setError('')
    setGreeting('')

    if (!helloUrl) {
      // config.json is empty until the app is deployed or a sandbox preview is running.
      setError('Action URL is not available yet. Deploy the app (aio app deploy) or start a preview to enable this.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(helloUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ims.token}`,
          'x-gw-ims-org-id': ims.org,
        },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
      const data = await res.json()
      setGreeting(data.message)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Provider theme={defaultTheme}>
      <View padding="size-400" maxWidth="size-6000" margin="0 auto">
        <Flex direction="column" gap="size-300">
          <Heading level={1}>Hello World</Heading>
          <Content>Enter a name and greet it through an Adobe I/O Runtime action.</Content>

          <TextField
            label="Name"
            value={name}
            onChange={setName}
            placeholder="World"
            width="100%"
            onKeyDown={(e) => e.key === 'Enter' && sayHello()}
          />

          <Flex gap="size-150" alignItems="center">
            <Button variant="accent" onPress={sayHello} isPending={isLoading}>
              Say Hello
            </Button>
            {isLoading && <ProgressCircle aria-label="Calling action" isIndeterminate size="S" />}
          </Flex>

          {greeting && (
            <Well>
              <Heading level={3} marginTop="size-0">{greeting}</Heading>
            </Well>
          )}

          {error && (
            <InlineAlert variant="negative">
              <Heading>Error</Heading>
              <Content>{error}</Content>
            </InlineAlert>
          )}
        </Flex>
      </View>
    </Provider>
  )
}
