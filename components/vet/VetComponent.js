import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Modal, Form, Input, message, Tag, Select } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined, ZoomInOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const VetComponent = () => {
    const [vets, setVets] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVet, setSelectedVet] = useState({});
    const [task, setTask] = useState("");
    // Form variables
    const [addEditVetForm] = Form.useForm();

    // Filter data
    const [searchName, setSearchName] = useState("");
    const [searchSpeciality, setSearchSpeciality] = useState("");


    // Modal variable
    const [isAddEditVetModalVisible, setIsSaveEditVetModalVisible] = useState(false);
    const [isVetDetailsModalVisible, setIsVetDetailsModalVisible] = useState(false);
    const [isVetSaveEditModalVisible, setIsVetSaveEditModalVisible] = useState(false);
    // Initial fetch 
    useEffect(() => {
        axios.get("api/speciality/get")
            .then((res) => {
                setSpecialities(res.data);
            })

            .catch((err) => { console.log(err) });
        setLoading(true);
        axios.get("api/vet/get")
            .then((res) => {
                setVets(res.data);
            })
            .then(() => {
                setLoading(false);
            })
            .catch((err) => { console.log(err) });
    }, [])


    // Search vet by name
    useEffect(() => {
        if (searchName !== "") {
            setLoading(true);
            axios.get(`api/vet/searchByName/${searchName}`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else if (searchName === "") {
            setLoading(true);
            axios.get(`api/vet/get`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }

    }, [searchName])


    useEffect(() => {
        if (searchSpeciality !== "") {
            setLoading(true);
            axios.get(`api/vet/searchBySpecialty/${searchSpeciality}`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else if (searchSpeciality === "") {
            setLoading(true);
            axios.get(`api/vet/get`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }

    }, [searchSpeciality])

    // Filter by speciality

    // Search vet by Vet
    const filterBySpeciality = (speciality) => {
        if (speciality === "all") {
            setLoading(true);
            axios.get(`api/vet/get`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else {

            setLoading(true);
            axios.get(`api/vet/find/${speciality}`)
                .then((res) => {
                    setVets(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }
    }


    // Show all the details of a vet
    const showVetDetailsModal = (vet) => {
        setSelectedVet(vet);
        setIsVetDetailsModalVisible(true);
    };
    const handleVetDetailsOk = () => {
        setIsVetDetailsModalVisible(false);
        setSelectedVet({});
    };
    const handleVetDetailsCancel = () => {
        setIsVetDetailsModalVisible(false);
        setSelectedVet({});
    };

    // Save or Edit Pet
    const showVetSaveEditModal = () => {
        setIsVetSaveEditModalVisible(true);
    };
    const handleVetSaveEditCancel = () => {
        setIsVetSaveEditModalVisible(false);
        setSelectedVet({});
        addEditVetForm.resetFields();
        setTask("");
    };

    const onFinishAddEditVet = (values) => {

        if (task === "edit") {
            values.vetId = selectedVet.vetId;
            setLoading(true);
            axios.put(`api/vet/update/${selectedVet.vetId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/vet/get")
                        .then((res) => {
                            setVets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });

        } else if (task === "save") {
            axios.post(`api/vet/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/vet/get")
                        .then((res) => {
                            setVets(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); message.warning(err.response.data.status); });
        }
        setTask("");
        setIsSaveEditVetModalVisible(false);
        setIsVetSaveEditModalVisible(false);
        addEditVetForm.resetFields();
    }
    const editVet = (vet) => {
        setIsVetSaveEditModalVisible(true);
        console.log(vet)
        setSelectedVet(vet);
        addEditVetForm.setFieldsValue(vet);

    }

    // Delete vet 
    const showDeleteConfirm = (vetId) => {
        confirm({
            title: 'Are you sure delete this vet',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`api/vet/delete/${vetId}`)
                    .then((res) => {
                        message.success(res.data.status)
                    }).then(data => {
                        setLoading(true);
                        axios.get("api/vet/get")
                            .then((res) => {
                                setVets(res.data);
                            })
                            .catch((err) => { console.log(err) });
                        setLoading(false);
                    })
                    .catch((err) => { console.log(err.response.data) });
            },

        });
    };

    const columns = [
        {
            title: 'SL. No',
            dataIndex: 'vetId',
            key: 'slNo',
            render: (vetId, vet, i) => <span>{i + 1}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Speciality',
            key: 'specialty',
            dataIndex: 'specialty',
            render: (specialty) => (
                <Tag color="geekblue" >
                    {specialty}
                </Tag>

            ),
        },
        {
            title: 'Action',
            dataIndex: 'vetId',
            key: 'action',
            render: (vetId, vet, i) => (
                <>
                    <Button style={{ marginRight: "1rem" }} type='default' icon={<ZoomInOutlined />} onClick={() => showVetDetailsModal(vet)}>Show</Button>
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editVet(vet); setTask("edit"); }}>Edit</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => showDeleteConfirm(vetId)}>Delete</Button>
                </>
            )

        },
    ];

    return (
        <Card bordered={false} title="Veterinary Information" extra={<Button type="primary" onClick={() => { showVetSaveEditModal(); setTask("save"); }}>Add</Button>} >
            <Row style={{ marginBottom: "1rem" }}>
                <Col sm={24} md={12} lg={8} xl={8}>
                    <Input style={{ width: "95%" }} value={searchName} placeholder='Filter veterinary by name' onChange={(e) => setSearchName(e.target.value)} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={8}>
                    <Input style={{ width: "95%" }} value={searchSpeciality} placeholder='Filter veterinary by speciality' onChange={(e) => setSearchSpeciality(e.target.value)} />
                </Col>
                <Col sm={24} md={12} lg={8} xl={8}>
                    <Select defaultValue="all" style={{ width: "95%" }} onChange={filterBySpeciality}>
                        <Select.Option value="all">All Specialties</Select.Option>
                        {
                            specialities.map(speciality => <Select.Option key={speciality.specialtyId} value={speciality.name}>{speciality.name}</Select.Option>)
                        }
                    </Select>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={vets}
                rowKey={(record) => record.vetId}
                pagination={false}
                loading={loading}
            />

            {/* Show vet details modal */}
            <Modal width={800} title="Vet Details" visible={isVetDetailsModalVisible} onOk={handleVetDetailsOk} onCancel={handleVetDetailsCancel}>
                <Card bordered={false} loading={loading}>
                    <p><b>Vet Id :</b><span style={{ marginLeft: "1rem" }}>{selectedVet.vetId}</span></p>
                    <p><b>Name :</b><span style={{ marginLeft: "1rem" }}>{selectedVet.name}</span></p>
                    <p><b>Address :</b><span style={{ marginLeft: "1rem" }}>{selectedVet.address}</span></p>
                    <p><b>Telephone No :</b><span style={{ marginLeft: "1rem" }}>{selectedVet.telephone}</span></p>
                    <p><b>Speciality :</b><span style={{ marginLeft: "1rem" }}>{selectedVet.specialty}</span></p>
                </Card>
            </Modal>


            {/* Add/Edit Vet modal */}
            <Modal width={700} title="Add or update Vet" visible={isVetSaveEditModalVisible} onCancel={handleVetSaveEditCancel} footer={null}>
                <Form form={addEditVetForm} onFinish={onFinishAddEditVet}>
                    <Form.Item name="name" label="Vet Name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input placeholder="Enter Vet name" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]}>
                        <Input placeholder="Enter your address" />
                    </Form.Item>
                    <Form.Item name="specialty" label="Speciality" rules={[{ required: true, message: "Speciality is required" }]} >
                        <Select>
                            {
                                specialities.map(speciality => <Select.Option key={speciality.specialtyId} value={speciality.name}>{speciality.name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="telephone" label="Telephone" rules={[{ required: true, message: "Telephone is required" }]}>
                        <Input placeholder="Enter your telephone" />
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

export default VetComponent