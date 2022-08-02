import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const PetComponent = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPet, setSelectedPet] = useState({});
    const [task, setTask] = useState("");

    // Form variables
    const [addEditPetForm] = Form.useForm();

    // Modal variable
    const [isAddEditPetModalVisible, setIsSaveEditPetModalVisible] = useState(false);

    // Initial fetch 
    useEffect(() => {
        setLoading(true);
        axios.get("api/pet/get")
            .then((res) => {
                setPets(res.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => { console.log(err) });
    }, [])

    // Delete  pet
    const showPetDeleteConfirm = (petId) => {
        confirm({
            title: 'Are you sure delete this pet',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setLoading(true);
                axios.delete(`api/pet/delete/${petId}`)
                    .then((res) => {
                        message.success(res.data.status);
                    })
                    .then(() => {
                        axios.get("api/pet/get")
                            .then((res) => {
                                setPets(res.data);
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

    // Edit/Add  pet
    const showAddEditPetModal = () => {
        setIsSaveEditPetModalVisible(true);
    };
    const handleAddEditPetCancel = () => {
        setIsSaveEditPetModalVisible(false);
        setTask("");
        addEditPetForm.resetFields();
        setSelectedPet({})
    };
    const editPet = (pet) => {
        setIsSaveEditPetModalVisible(true);
        addEditPetForm.setFieldsValue(pet);
        setSelectedPet(pet);
    }

    const onFinishAddEditPet = (values) => {

        if (task === "edit") {
            values.petId = selectedPet.petId;
            setLoading(true);
            axios.put(`api/pet/update/${selectedPet.petId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/pet/get")
                        .then((res) => {
                            setPets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });

        } else if (task === "save") {
            axios.post(`api/pet/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/pet/get")
                        .then((res) => {
                            setPets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });
        }
        setTask("");
        setIsSaveEditPetModalVisible(false);
        addEditPetForm.resetFields();
    }

    //  pet column
    const petColumns = [
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
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editPet(pet); setTask("edit"); }}>Edit</Button>
                    <Button disabled danger icon={<CloseOutlined />} onClick={() => showPetDeleteConfirm(petId)}>Delete</Button>
                </>
            )

        },
    ]
    return (
        <Card bordered={false} title="Pet Information" extra={<Button type="primary" onClick={() => { showAddEditPetModal(); setTask("save"); }}>Add </Button>} >
            <Row>
                <Col span={24}>
                </Col>
            </Row>
            <Table
                columns={petColumns}
                dataSource={pets}
                rowKey={(record) => record.petId}
                pagination={false}
                loading={loading}
            />

            {/* Add/Edit  pet modal */}
            <Modal title="Add or update pet" visible={isAddEditPetModalVisible} onCancel={handleAddEditPetCancel} footer={null}>
                <Form form={addEditPetForm} onFinish={onFinishAddEditPet}>
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

export default PetComponent