"use client"
import { Input, AutoComplete } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const options = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "Tables", label: "Tables" },
  { value: "Forms", label: "Forms" },
  { value: "Profile", label: "Profile" },
  { value: "Settings", label: "Settings" },
]

export function SearchForm() {
  return (
    <div style={{ padding: "0 16px", marginBottom: 16 }}>
      <AutoComplete
        style={{ width: "100%" }}
        options={options}
        filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      >
        <Input size="middle" placeholder="Search..." prefix={<SearchOutlined />} />
      </AutoComplete>
    </div>
  )
}
