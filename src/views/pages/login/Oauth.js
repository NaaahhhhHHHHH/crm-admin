import React, { useEffect, useRef, useState } from "react";
import {
    Table,
    Space,
    Input,
    Button,
    Modal,
    Form,
    message,
    Row,
    Col,
    Popconfirm,
    Select,
} from "antd";
import {
    SearchOutlined,
    FileAddOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getData, createData, updateData, deleteData } from "../../../api";

const OAuthClientTable = () => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [form] = Form.useForm();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    // ================= SEARCH HANDLERS ====================
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<SearchOutlined />}
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>

                    <Button type="link" size="small" onClick={close}>
                        Close
                    </Button>
                </Space>
            </div>
        ),

        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),

        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text?.toString()}
                />
            ) : (
                text
            ),
    });

    // ================ LOAD DATA =====================
    const loadClients = async () => {
        try {
            const res = await getData("oauth/clients");
            setData(res.data.data);
        } catch (err) {
            message.error("Failed to load OAuth clients");
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    // ================ CRUD HANDLERS =====================
    const showModal = (client) => {
        if (client) {
            setCurrentClient(client);
            form.setFieldsValue({
                ...client,
                redirect_uris: JSON.parse(client.redirect_uris),
                grant_types: JSON.parse(client.grant_types),
            });
        } else {
            setCurrentClient(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleDelete = async (client_id) => {
        try {
            await deleteData("oauth/clients", client_id);
            message.success("Deleted successfully");
            loadClients();
        } catch (err) {
            message.error("Delete failed");
        }
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            redirect_uris: JSON.stringify(values.redirect_uris || []),
            grant_types: JSON.stringify(values.grant_types || []),
        };

        try {
            if (currentClient) {
                await updateData("oauth/clients", currentClient.client_id, payload);
                message.success("Updated successfully");
            } else {
                await createData("oauth/clients", payload);
                message.success("Created successfully");
            }
            loadClients();
            setIsModalVisible(false);
            form.resetFields();
            setCurrentClient(null);
        } catch (err) {
            message.error(err?.response?.data?.error || "Save failed");
        }
    };

    // ================ TABLE COLUMNS =====================
    const columns = [
        {
            title: "Client ID",
            dataIndex: "client_id",
            key: "client_id",
            width: 150,
            fixed: "left",
            ...getColumnSearchProps("client_id"),
        },
        {
            title: "Client Name",
            dataIndex: "client_name",
            key: "client_name",
            ...getColumnSearchProps("client_name"),
        },
        {
            title: "Redirect URIs",
            dataIndex: "redirect_uris",
            key: "redirect_uris",
            render: (text) => {
                let arr = [];
                try {
                    arr = JSON.parse(text);
                } catch {
                    arr = text || [];
                }
                return arr.map((uri, index) => <div key={index}>{uri}</div>);
            },
            //...getColumnSearchProps("redirect_uris"),
        },
        {
            title: "Grant Types",
            dataIndex: "grant_types",
            key: "grant_types",
            render: (text) => {
                let arr = [];
                try {
                    arr = JSON.parse(text);
                } catch {
                    arr = text || [];
                }
                return arr.map((g, index) => <div key={index}>{g}</div>);
            },
            //...getColumnSearchProps("grant_types"),
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 150,
            align: "center",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        size="large"
                        variant="text"
                        onClick={() => showModal(record)}
                    >
                        <EditOutlined style={{ fontSize: 18 }} />
                    </Button>

                    <Popconfirm
                        title="Delete OAuth Client"
                        description="Are you sure to delete this client?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record.client_id)}
                    >
                        <Button type="link" size="large" danger variant="text">
                            <DeleteOutlined style={{ fontSize: 18 }} />
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    // ================ MODAL FORM =====================
    return (
        <>
            <Row style={{ display: 'block', marginBottom: 5, textAlign: 'right' }}>
                <Col>
                    <Button color="primary" size="large" variant="text" onClick={() => showModal(null)}>
                        <FileAddOutlined style={{ fontSize: 20 }} />
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="client_id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: "100%" }}
            />

            <Modal
                title={currentClient ? "Edit OAuth Client" : "Add OAuth Client"}
                open={isModalVisible}
                style={{ top: 120 }}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentClient(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} labelCol={{ span: 7 }}>
                    <Form.Item
                        name="client_id"
                        label="Client ID"
                        rules={[{ required: true }]}
                    >
                        <Input disabled={!!currentClient} />
                    </Form.Item>

                    <Form.Item
                        name="client_secret"
                        label="Client Secret"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="client_name"
                        label="Client Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Redirect URIs */}
                    <Form.Item
                        name="redirect_uris"
                        label="Redirect URIs"
                        rules={[{ required: true }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Add redirect URLs"
                            tokenSeparators={[","]}
                        />
                    </Form.Item>

                    {/* Grant Types */}
                    <Form.Item
                        name="grant_types"
                        label="Grant Types"
                        rules={[{ required: true }]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Add grant types"
                            tokenSeparators={[","]}
                            options={[
                                { value: "authorization_code" },
                                { value: "refresh_token" },
                            ]}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit">
                            {currentClient ? "Update" : "Add"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default OAuthClientTable;
