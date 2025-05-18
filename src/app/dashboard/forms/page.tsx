"use client"
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Upload,
  Card,
  Row,
  Col,
  Divider,
  message,
} from "antd"
import { UploadOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons"
import { useTheme } from "@/components/theme-context"

const { Option } = Select
const { TextArea } = Input

export default function FormsPage() {
  const [form] = Form.useForm()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const onFinish = (values: any) => {
    console.log("Form values:", values)
    message.success("Form submitted successfully!")
  }

  const onReset = () => {
    form.resetFields()
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: isDark ? "#fff" : "#000",
          }}
        >
          Form Examples
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Create and manage forms with various input types and validations.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ color: isDark ? "#fff" : "#000" }}>Product Information Form</span>}
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              background: isDark ? "#1f1f1f" : "#fff",
            }}
            headStyle={{ borderBottom: `1px solid ${isDark ? "#303030" : "#f0f0f0"}` }}
          >
            <Form
              form={form}
              name="product_form"
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                status: true,
                stock: 1,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: "Please enter product name" }]}
                  >
                    <Input placeholder="Enter product name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="sku" label="SKU" rules={[{ required: true, message: "Please enter SKU" }]}>
                    <Input placeholder="Enter SKU" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Please select category" }]}
                  >
                    <Select placeholder="Select a category">
                      <Option value="electronics">Electronics</Option>
                      <Option value="clothing">Clothing</Option>
                      <Option value="home">Home & Kitchen</Option>
                      <Option value="books">Books</Option>
                      <Option value="sports">Sports & Outdoors</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="subcategory" label="Subcategory">
                    <Select placeholder="Select a subcategory">
                      <Option value="phones">Phones</Option>
                      <Option value="laptops">Laptops</Option>
                      <Option value="accessories">Accessories</Option>
                      <Option value="audio">Audio</Option>
                      <Option value="cameras">Cameras</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      step={0.01}
                      precision={2}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="stock"
                    label="Stock Quantity"
                    rules={[{ required: true, message: "Please enter stock quantity" }]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter quantity" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
              >
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="releaseDate" label="Release Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="status" label="Status" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="images" label="Product Images" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload name="logo" action="/api/upload" listType="picture" multiple>
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>

              <Divider style={{ borderColor: isDark ? "#303030" : "#f0f0f0" }} />

              <Form.Item>
                <Row gutter={8} justify="end">
                  <Col>
                    <Button icon={<CloseOutlined />} onClick={onReset}>
                      Reset
                    </Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ color: isDark ? "#fff" : "#000" }}>Form Help</span>}
            bordered={false}
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              background: isDark ? "#1f1f1f" : "#fff",
            }}
            headStyle={{ borderBottom: `1px solid ${isDark ? "#303030" : "#f0f0f0"}` }}
          >
            <h4 style={{ color: isDark ? "#fff" : "#000" }}>Guidelines for Product Information</h4>
            <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)" }}>
              Fill out the form with accurate product details. All fields marked with an asterisk (*) are required.
            </p>
            <Divider style={{ borderColor: isDark ? "#303030" : "#f0f0f0" }} />
            <h4 style={{ color: isDark ? "#fff" : "#000" }}>Tips</h4>
            <ul style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)" }}>
              <li>Use clear, descriptive product names</li>
              <li>Include detailed product descriptions</li>
              <li>Upload high-quality images (max 5MB each)</li>
              <li>Set accurate pricing and inventory levels</li>
            </ul>
            <Divider style={{ borderColor: isDark ? "#303030" : "#f0f0f0" }} />
            <h4 style={{ color: isDark ? "#fff" : "#000" }}>Need Help?</h4>
            <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)" }}>
              If you have any questions about this form, please contact the support team at{" "}
              <a href="mailto:support@example.com">support@example.com</a>
            </p>
          </Card>
        </Col>
      </Row>
    </>
  )
}
