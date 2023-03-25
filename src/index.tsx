import { ChangeEvent, useState } from 'react'

import ReactDOM from 'react-dom/client'
import './index.css'

interface Param {
  id: number
  name: string
  type: 'string'
}

interface ParamValue {
  paramId: number
  value: string
}

interface Model {
  paramValues: ParamValue[]
  colors: Color[]
}

interface Color {
  color: string
}

interface Props {
  params: Param[]
  model: Model
}

interface ParamRow {
  id: number
  name: string
  value: string
  onChangeValue: (value: string, id: number) => void
}

interface ParamForm {
  handleAddParam: (name: string) => void
}

interface ModelView {
  paramValues: ParamValue[]
}

const getParamValue = (id: number, paramValues: ParamValue[]): string => {
  const value = paramValues.find((param) => {
    return id === param.paramId
  })

  return value?.value || ''
}

const ModelView: React.FC<ModelView> = ({ paramValues }) => {
  return (
    <div>
      {paramValues.map((item) => (
        <div key={item.paramId}>
          paramId: {item.paramId} value: {item.value}{' '}
        </div>
      ))}
    </div>
  )
}

const ParamForm: React.FC<ParamForm> = ({ handleAddParam }) => {
  const [value, setValue] = useState('')

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleClick = () => {
    if (value) {
      handleAddParam(value)
      setValue('')
    }
  }

  return (
    <div className="ParamForm">
      <input
        placeholder="Add Param"
        value={value}
        onChange={handleChangeValue}
      />
      <button onClick={handleClick}>Add</button>
    </div>
  )
}

const ParamRow: React.FC<ParamRow> = ({ id, name, value, onChangeValue }) => {
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value, id)
  }

  return (
    <div className="ParamRow">
      <h2 className="ParamRow__name">{name}</h2>
      <input placeholder="value" value={value} onChange={handleChangeValue} />
    </div>
  )
}

const ParamEditor: React.FC<Props> = ({ params, model }) => {
  const [settings, setSettings] = useState(params)
  const [sample, setSample] = useState(model)
  const [toggle, setToggle] = useState(false)

  const onChangeParamValue = (value: string, id: number) => {
    setSample((sample) => ({
      ...sample,
      paramValues: sample.paramValues.map((item) =>
        item.paramId === id ? { ...item, value } : item
      ),
    }))
  }

  const handleAddParam = (name: string) => {
    setSettings((settings) => [
      ...settings,
      { id: settings.length + 1, name: name, type: 'string' },
    ])
    setSample((sample) => ({
      ...sample,
      paramValues: [
        ...sample.paramValues,
        { paramId: settings.length + 1, value: '' },
      ],
    }))
  }

  const handleToggle = () => {
    setToggle((prev) => !prev)
  }

  return (
    <div className="ParamEditor">
      {settings.map((setting) => (
        <ParamRow
          key={setting.id}
          id={setting.id}
          name={setting.name}
          value={getParamValue(setting.id, sample.paramValues)}
          onChangeValue={onChangeParamValue}
        />
      ))}
      <ParamForm handleAddParam={handleAddParam} />
      <button onClick={handleToggle}>
        {!toggle ? 'Get Model' : 'Hide Model'}
      </button>
      {toggle && <ModelView paramValues={sample.paramValues} />}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ParamEditor
    params={[
      { id: 1, name: 'Назначение', type: 'string' },
      { id: 2, name: 'Длина', type: 'string' },
    ]}
    model={{
      paramValues: [
        { paramId: 1, value: 'повседневное' },
        { paramId: 2, value: 'макси' },
      ],
      colors: [{ color: 'белый' }, { color: 'черный' }],
    }}
  />
)
