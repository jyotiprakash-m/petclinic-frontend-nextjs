import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Tag, Modal, Form, Input, Select, message, Space } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined, ZoomInOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const OwnerComponent = () => {
    const [owners, setOwners] = useState([]);
    const [validPets, setValidPets] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState({});
    const [selectedPet, setSelectedPet] = useState({});
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState("");

    // Filter data
    const [searchName, setSearchName] = useState("");

    // Form variables 
    const [addEditPetForm] = Form.useForm();
    const [saveEditOwnerForm] = Form.useForm();
    // Modal variables
    const [isAddEditPetModalVisible, setIsSaveEditPetModalVisible] = useState(false);
    const [isOwnerDetailsModalVisible, setIsOwnerDetailsModalVisible] = useState(false);
    const [isOwnerSaveEditModalVisible, setIsOwnerSaveEditModalVisible] = useState(false);

    useEffect(() => {
        axios.get("api/validPet/get")
            .then((res) => {
                setValidPets(res.data);
            })
            .catch((err) => { console.log(err) });
        setLoading(true);
        axios.get("api/owner/get")
            .then((res) => {
                setOwners(res.data);
            })
            .catch((err) => { console.log(err) });
        setLoading(false);

    }, [])

    // ------------------ Filter owner by name -----------------------

    // console.log(searchName)

    useEffect(() => {
        if (searchName !== "") {
            setLoading(true);
            axios.get(`api/owner/search/${searchName}`)
                .then((res) => {
                    setOwners(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else if (searchName === "") {
            setLoading(true);
            axios.get(`api/owner/get`)
                .then((res) => {
                    setOwners(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }

    }, [searchName])

    //------------------- Owner related functions ---------------------

    // Show all the details of an owner
    const showOwnerDetailsModal = (owner) => {
        setSelectedOwner(owner);
        setIsOwnerDetailsModalVisible(true);
    };
    const handleOwnerDetailsOk = () => {
        setIsOwnerDetailsModalVisible(false);
        setSelectedOwner({});
    };
    const handleOwnerDetailsCancel = () => {
        setIsOwnerDetailsModalVisible(false);
        setSelectedOwner({});
    };

    // Save or Edit owner
    const showOwnerSaveEditModal = () => {
        setIsOwnerSaveEditModalVisible(true);
    };
    const handleOwnerSaveEditCancel = () => {
        setIsOwnerSaveEditModalVisible(false);
        setSelectedOwner({});
        saveEditOwnerForm.resetFields();
        setTask("");
    };


    const onFinishOwnerSaveEdit = (values) => {
        if (task === "save") {
            var pet = {}, pets = [];
            pet.petName = values.petName;
            pet.type = values.type;
            pets.push(pet);
            values.pets = pets;
            delete values.petName;
            delete values.type;
            axios.post(`api/owner/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                }).then(() => {
                    setLoading(true);

                    axios.get("api/owner/get")
                        .then((res) => {
                            setOwners(res.data);
                        })
                        .catch((err) => { console.log(err) });
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                });
        } else if (task === "edit") {
            console.log(selectedOwner)
            values.ownerId = selectedOwner.ownerId;
            values.pets = selectedOwner.pets;
            axios.put(`api/owner/update/${selectedOwner.ownerId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                }).then(() => {
                    setLoading(true);

                    axios.get("api/owner/get")
                        .then((res) => {
                            setOwners(res.data);
                        })
                        .catch((err) => { console.log(err) });
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                });
        }
        // console.log(values);

        setIsOwnerSaveEditModalVisible(false);
        setSelectedOwner({})
        saveEditOwnerForm.resetFields();
        setTask("");
    }

    const editOwner = (owner) => {
        setIsOwnerSaveEditModalVisible(true);
        setSelectedOwner(owner);
        saveEditOwnerForm.setFieldsValue(owner);

    }
    // console.log("Valid pets :", validPets)
    // Delete owner 
    const showDeleteConfirm = (ownerId) => {
        confirm({
            title: 'Are you sure delete this owner',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`api/owner/delete/${ownerId}`)
                    .then((res) => {
                        message.success(res.data.status)
                    }).then(data => {
                        setLoading(true);
                        axios.get("api/owner/get")
                            .then((res) => {
                                setOwners(res.data);
                            })
                            .catch((err) => { console.log(err) });
                        setLoading(false);
                    })
                    .catch((err) => { console.log(err) });
            },

        });
    };

    // ----------------- Pet Related functions ----------------------
    // Save or Edit pet
    const showAddEditPetModal = (owner) => {
        setIsSaveEditPetModalVisible(true);
        setSelectedOwner(owner)
    };
    const onFinishAddEditPet = (values) => {
        let petSaveOrEditUrl = task === "save" ? `api/owner/${selectedOwner.ownerId}/add/pet` : task === "edit" ? `api/owner/${selectedOwner.ownerId}/update/pet/${selectedPet.petId}` : "";
        if (task === "edit") {
            values.petId = selectedPet.petId;
            axios.put(petSaveOrEditUrl, values)
                .then((res) => {
                    console.log(res.data);
                    return res;
                }).then((res) => {
                    message.success(res.data.status)
                }).then(() => {
                    setLoading(true);
                    axios.get(`api/owner/get/${selectedOwner.ownerId}`)
                        .then((res) => {
                            setSelectedOwner(res.data);
                        })
                        .catch((err) => { console.log(err) });
                    setLoading(false);
                }).then(() => {
                    setLoading(true);
                    axios.get("api/owner/get")
                        .then((res) => {
                            setOwners(res.data);
                        })
                        .catch((err) => { console.log(err) });
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    message.warning(err.status);
                });
        } else if (task === "save") {
            axios.post(petSaveOrEditUrl, values)
                .then((res) => {
                    console.log(res.data);
                    return res;
                }).then((res) => {
                    message.success(res.data.status)
                }).then(() => {
                    setLoading(true);
                    axios.get("api/owner/get")
                        .then((res) => {
                            setOwners(res.data);
                        })
                        .catch((err) => { console.log(err) });
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    message.warning(err.status);
                });
        }

        addEditPetForm.resetFields();
        setIsSaveEditPetModalVisible(false);
        setSelectedPet({});
        setSelectedOwner({});
        setTask("");
    };

    const handleAddEditPetCancel = () => {
        setIsSaveEditPetModalVisible(false);
        setSelectedPet({});
        setTask("");
    };
    // Edit Pet
    const editPet = (pet) => {
        addEditPetForm.setFieldsValue(pet);
        setIsSaveEditPetModalVisible(true);
        setSelectedPet(pet);
        showAddEditPetModal(selectedOwner);
    }

    // Delete pet from the owner
    const showPetDeleteConfirm = (petId) => {
        confirm({
            title: 'Are you sure delete this pet',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`api/owner/${selectedOwner.ownerId}/delete/pet/${petId}`)
                    .then((res) => {
                        message.success(res.data.status);
                    }).then(data => {
                        setLoading(true);
                        // fetch the owner data using id
                        axios.get(`api/owner/get/${selectedOwner.ownerId}`)
                            .then((res) => {
                                setSelectedOwner(res.data);
                            })
                            .catch((err) => { console.log(err) });
                        // Fetch the owners details
                        axios.get("api/owner/get")
                            .then((res) => {
                                setOwners(res.data);
                            })
                            .catch((err) => { console.log(err) });
                        setLoading(false);
                    })
                    .catch((err) => { console.log(err) });
            },

        });
    };



    // Column Structures

    // Owner column structure
    const columns = [
        {
            title: 'SL. No',
            dataIndex: 'ownerId',
            key: 'slNo',
            render: (ownerId, owners, i) => <span>{i + 1}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Pets',
            key: 'pets',
            dataIndex: 'pets',
            render: (pets) => (
                <span>
                    {pets.map((pet) => {

                        return (
                            <Tag color="geekblue" key={pet.petId}>
                                {pet.petName} - <b>{pet.type}</b>
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'ownerId',
            key: 'action',
            render: (ownerId, owner, i) => (
                <>
                    <Button style={{ marginRight: "1rem" }} type='default' icon={<ZoomInOutlined />} onClick={() => showOwnerDetailsModal(owner)}>Show</Button>
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editOwner(owner); setTask("edit"); }}>Edit</Button>
                    <Button style={{ marginRight: "1rem", borderColor: "green", color: "green" }} type='default' icon={<PlusOutlined />} onClick={() => { showAddEditPetModal(owner); setTask("save"); }}>Add Pet</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => showDeleteConfirm(ownerId)}>Delete</Button>
                </>
            )

        },
    ];

    // Pet Column structure
    const petColumns = [
        {
            title: 'SL. No',
            dataIndex: 'petId',
            key: 'slNo',
            render: (petId, owner, i) => <span>{i + 1}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'petName',
            key: 'petName',
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
                    <Button danger icon={<CloseOutlined />} onClick={() => showPetDeleteConfirm(petId)}>Delete</Button>
                </>
            )

        },
    ]



    return (
        <Card bordered={false} title="Owner Information" extra={<Button type="primary" onClick={() => { showOwnerSaveEditModal(); setTask("save"); }}>Add </Button>} >
            <Row style={{ marginBottom: "1rem" }}>
                <Col span={24}>
                    <Input value={searchName} placeholder='Filter owner by name' onChange={(e) => setSearchName(e.target.value)} />
                </Col>
            </Row>

            <Table
                columns={columns}
                rowKey={(record) => record.ownerId}
                dataSource={owners}
                pagination={false}
                loading={loading}
            />

            {/* Add/Edit pet modal */}
            <Modal zIndex={1003} title="Add or update pet" visible={isAddEditPetModalVisible} onCancel={handleAddEditPetCancel} footer={null}>
                <Form form={addEditPetForm} onFinish={onFinishAddEditPet}>

                    <Form.Item name="petName" label="Pet Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter pet name" />
                    </Form.Item>
                    <Form.Item name="type" label="Pet Type" rules={[{ required: true }]}>
                        <Select>
                            {
                                validPets.map(validPet => <Select.Option key={validPet.petId} value={validPet.type}>{validPet.type}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Row justify='end'>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Row>
                </Form>
            </Modal>

            {/* Show owners details modal */}
            <Modal width={800} title="Owner Details" visible={isOwnerDetailsModalVisible} onOk={handleOwnerDetailsOk} onCancel={handleOwnerDetailsCancel}>
                <Card bordered={false} loading={loading}>
                    <p><b>Owner Id :</b><span style={{ marginLeft: "1rem" }}>{selectedOwner.ownerId}</span></p>
                    <p><b>Name :</b><span style={{ marginLeft: "1rem" }}>{selectedOwner.name}</span></p>
                    <p><b>Address :</b><span style={{ marginLeft: "1rem" }}>{selectedOwner.address}</span></p>
                    <p><b>City :</b><span style={{ marginLeft: "1rem" }}>{selectedOwner.city}</span></p>
                    <p><b>Telephone No :</b><span style={{ marginLeft: "1rem" }}>{selectedOwner.telephone}</span></p>
                    <p><b>All Pets :</b></p>
                    <Table
                        columns={petColumns}
                        dataSource={selectedOwner.pets}
                        rowKey={(record) => record.petId}
                        pagination={false}
                        loading={loading}
                    />
                </Card>
            </Modal>

            {/* Add/Edit Owner modal */}
            <Modal width={700} title="Add or update Owner" visible={isOwnerSaveEditModalVisible} onCancel={handleOwnerSaveEditCancel} footer={null}>
                <Form form={saveEditOwnerForm} onFinish={onFinishOwnerSaveEdit}>
                    <Form.Item name="name" label="Owner Name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input placeholder="Enter owner name" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]}>
                        <Input placeholder="Enter your address" />
                    </Form.Item>
                    <Form.Item name="city" label="City name" rules={[{ required: true, message: "City is required" }]}>
                        <Input placeholder="Enter your city " />
                    </Form.Item>
                    <Form.Item name="telephone" label="Telephone" rules={[{ required: true, message: "Telephone is required" }]}>
                        <Input placeholder="Enter your telephone" />
                    </Form.Item>
                    {task === "save" &&
                        <>
                            <Form.Item name="petName" label="Pet Name" rules={[{ required: true, message: "Pet name is required" }]}>
                                <Input placeholder='Enter per name' />
                            </Form.Item>
                            <Form.Item name="type" label="Pet Type" rules={[{ required: true, message: "Pet type is required" }]} >
                                <Select>
                                    {
                                        validPets.map(validPet => <Select.Option key={validPet.petId} value={validPet.type}>{validPet.type}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    }

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

export default OwnerComponent