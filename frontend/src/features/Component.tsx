import { Params, useParams } from 'react-router-dom'

export type ComponentProps<T extends Readonly<Params<string>>> = {
  children: (params: T) => JSX.Element
}

export function Component<T extends Readonly<Params<string>>>(props: ComponentProps<T>) {
  const params = useParams()
  return (
    <>
      {props.children(params as T)}
    </>
  )
}
