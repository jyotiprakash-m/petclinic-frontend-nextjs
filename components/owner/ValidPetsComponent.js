import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const ValidPetsComponent = () => {
    const [validPets, setValidPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedValidPet, setSelectedValidPet] = useState({});
    const [task, setTask] = useState("");

    // Form variables
    const [addEditValidPetForm] = Form.useForm();

    // Modal variable
    const [isAddEditValidPetModalVisible, setIsSaveEditValidPetModalVisible] = useState(false);

    // Initial fetch 
    useEffect(() => {
        setLoading(true);
        axios.get("api/validPet/get")
            .then((res) => {
                setValidPets(res.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => { console.log(err) });
    }, [])
    console.log(validPets)


    // Delete valid pet
    const showPetDeleteConfirm = (petId) => {
        confirm({
            title: 'Are you sure delete this pet',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // delete/{id}
                setLoading(true);
                axios.delete(`api/validPet/delete/${petId}`)
                    .then((res) => {
                        message.success(res.data.status);
                    })
                    .then(() => {
                        axios.get("api/validPet/get")
                            .then((res) => {
                                setValidPets(res.data);
                            })
                            .catch((err) => { console.log(err) });
                    })
                    .then(() => {
                        setLoading(false);
                    })
                    .catch((err) => { console.log(err); message.warning(err.response.data.status); });
            },

        });
    }

    // Edit/Add valid pet
    const showAddEditValidPetModal = () => {
        setIsSaveEditValidPetModalVisible(true);
    };
    const handleAddEditValidPetCancel = () => {
        setIsSaveEditValidPetModalVisible(false);
        setTask("");
        addEditValidPetForm.resetFields();
        setSelectedValidPet({})
    };
    const editValidPet = (pet) => {
        setIsSaveEditValidPetModalVisible(true);
        addEditValidPetForm.setFieldsValue(pet);
        setSelectedValidPet(pet);
    }

    const onFinishAddEditValidPet = (values) => {

        if (task === "edit") {
            values.petId = selectedValidPet.petId;
            setLoading(true);
            axios.put(`api/validPet/update/${selectedValidPet.petId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/validPet/get")
                        .then((res) => {
                            setValidPets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });

        } else if (task === "save") {
            axios.post(`api/validPet/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/validPet/get")
                        .then((res) => {
                            setValidPets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });
        }
        setTask("");
        setIsSaveEditValidPetModalVisible(false);
        addEditValidPetForm.resetFields();
    }



    // Valid pet column
    const validPetColumns = [
        {
            title: 'SL. No',
            dataIndex: 'petId',
            key: 'slNo',
            render: (petId, pet, i) => <span>{i + 1}</span>,
        },

        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'petId',
            key: 'action',
            render: (petId, pet, i) => (
                <>
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editValidPet(pet); setTask("edit"); }}>Edit</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => showPetDeleteConfirm(petId)}>Delete</Button>
                </>
            )

        },
    ]
    return (
        <Card bordered={false} title="Valid pet Information" extra={<Button type="primary" onClick={() => { showAddEditValidPetModal(); setTask("save"); }}>Add </Button>} >
            <Row>
                <Col span={24}>
                </Col>
            </Row>
            <Table
                columns={validPetColumns}
                dataSource={validPets}
                rowKey={(record) => record.petId}
                pagination={false}
                loading={loading}
            />

            {/* Add/Edit valid pet modal */}
            <Modal title="Add or update pet" visible={isAddEditValidPetModalVisible} onCancel={handleAddEditValidPetCancel} footer={null}>
                <Form form={addEditValidPetForm} onFinish={onFinishAddEditValidPet}>
                    <Form.Item name="type" label="Pet Type" rules={[{ required: true }]}>
                        <Input placeholder="Enter pet type" />
                    </Form.Item>
                    <Row justify='end'>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Row>
                </Form>
            </Modal>


        </Card>
    )
}

export default ValidPetsComponent