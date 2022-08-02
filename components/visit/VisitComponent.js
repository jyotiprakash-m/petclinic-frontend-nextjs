import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Table, Modal, Form, Input, message, Tag, Select, Typography, Checkbox } from 'antd';
import axios from 'axios';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined, ZoomInOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const { Title } = Typography;
const VisitComponent = () => {
    const [pets, setPets] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState({});
    const [task, setTask] = useState("");

    // Filter data
    const [searchName, setSearchName] = useState("");
    const [searchPetId, setSearchPetId] = useState("");
    const [petOptionForListSearch, setPetOptionForListSearch] = useState([]);

    console.log(petOptionForListSearch)

    // Form variables
    const [addEditVisitForm] = Form.useForm();

    // Modal variable
    const [isSaveEditVisitModalVisible, setIsSaveEditVisitModalVisible] = useState(false);
    const [isVisitDetailsModalVisible, setIsVisitDetailsModalVisible] = useState(false);
    // Initial fetch 
    useEffect(() => {
        axios.get("api/pet/get")
            .then((res) => {
                // Format pet data
                let optionData = [];
                res.data.forEach((element, index) => {
                    optionData.push({ label: element.type, value: element.petId })

                });
                setPets(res.data);
                setPetOptionForListSearch(optionData);
            })
            .catch((err) => { console.log(err) });
        setLoading(true);
        axios.get("api/visit/get")
            .then((res) => {
                setVisits(res.data);
            })
            .catch((err) => { console.log(err) });
        setLoading(false);
    }, [])


    // Filter by visiter name
    useEffect(() => {
        if (searchName !== "") {
            setLoading(true);
            axios.get(`api/visit/search/${searchName}`)
                .then((res) => {
                    setVisits(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else if (searchName === "") {
            setLoading(true);
            axios.get(`api/visit/get`)
                .then((res) => {
                    setVisits(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }

    }, [searchName])

    // Filte by petId

    const filterVisitsByPetId = (petId) => {
        if (petId !== "all") {
            setLoading(true);
            axios.get(`api/visit/get/${petId}`)
                .then((res) => {
                    setVisits(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        } else {
            setLoading(true);
            axios.get(`api/visit/get`)
                .then((res) => {
                    setVisits(res.data);
                }).then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err) });
        }

    }

    // Show all the details of a visit
    const showVisitDetailsModal = (visit) => {
        setSelectedVisit(visit);
        setIsVisitDetailsModalVisible(true);
    };
    const handleVisitDetailsOk = () => {
        setIsVisitDetailsModalVisible(false);
        setSelectedVisit({});
    };
    const handleVisitDetailsCancel = () => {
        setIsVisitDetailsModalVisible(false);
        setSelectedVisit({});
    };

    // Save or Edit Pet
    const showVisitSaveEditModal = () => {
        setTask("save");
        setIsSaveEditVisitModalVisible(true);
    };
    const handleVisitSaveEditCancel = () => {
        setIsSaveEditVisitModalVisible(false);
        setSelectedVisit({});
        addEditVisitForm.resetFields();
        setTask("");
    };


    const onFinishAddEditVisit = (values) => {


        if (task === "edit") {
            values.visitorId = selectedVisit.visitorId;
            setLoading(true);
            axios.put(`api/visit/update/${selectedVisit.visitorId}`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/visit/get")
                        .then((res) => {
                            setVisits(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); setLoading(false) });

        } else if (task === "save") {
            axios.post(`api/visit/save`, values)
                .then((res) => {
                    message.success(res.data.status);
                })
                .then(() => {
                    axios.get("api/visit/get")
                        .then((res) => {
                            setVisits(res.data);
                        })
                        .catch((err) => { console.log(err) });
                })
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); });
        }
        setTask("");
        setIsSaveEditVisitModalVisible(false);
        addEditVisitForm.resetFields();
    }
    const editVisit = (visit) => {
        setIsSaveEditVisitModalVisible(true);
        setSelectedVisit(visit);
        addEditVisitForm.setFieldsValue(visit);
    }


    // Delete  pet
    const showVisitDeleteConfirm = (visitorId) => {
        confirm({
            title: 'Are you sure delete this Visit detail',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                setLoading(true);
                axios.delete(`api/visit/delete/${visitorId}`)
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
                    .catch((err) => { console.log(err); });
            },

        });
    }

    // The function who return the pet type 
    const findPetNameById = (petId) => {
        let pet = pets.filter(pet => pet.petId == petId);
        return pet[0]?.type;
    }

    // filter vist by pet id list

    const onChangePetIds = (checkedValues) => {
        console.log(checkedValues);
        setLoading(true)
        if (checkedValues.length === 0) {
            setLoading(true);
            axios.get("api/visit/get")
                .then((res) => {
                    setVisits(res.data);
                })
                .catch((err) => { console.log(err) });
            setLoading(false);
        } else {

            axios.post(`api/visit/filter/petIdList`, checkedValues)
                .then((res) => {
                    setVisits(res.data);
                })

                .then(() => {
                    setLoading(false);
                })
                .catch((err) => { console.log(err); });
        }
    };
    const columns = [
        {
            title: 'SL. No',
            dataIndex: 'visitorId',
            key: 'slNo',
            render: (visitorId, visit, i) => <span>{i + 1}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Pet Type',
            key: 'petId',
            dataIndex: 'petId',
            render: (petId) => (
                <Tag color="geekblue" >
                    {findPetNameById(petId)} - <b>{petId}</b>
                </Tag>

            ),
        },
        {
            title: 'Action',
            dataIndex: 'visitorId',
            key: 'action',
            render: (visitorId, visit, i) => (
                <>
                    <Button style={{ marginRight: "1rem" }} type='default' icon={<ZoomInOutlined />} onClick={() => showVisitDetailsModal(visit)}>Show</Button>
                    <Button style={{ marginRight: "1rem", borderColor: "blue", color: "blue" }} type='default' icon={<EditOutlined />} onClick={() => { editVisit(visit); setTask("edit"); }}>Edit</Button>
                    <Button danger icon={<CloseOutlined />} onClick={() => showVisitDeleteConfirm(visitorId)}>Delete</Button>
                </>
            )

        },
    ];



    return (
        <Card bordered={false} title="Visit Information" extra={<Button type="primary" onClick={showVisitSaveEditModal}>Add </Button>} >
            <Row style={{ marginBottom: "1rem" }}>
                <Col sm={24} md={12} lg={12} xl={12}>
                    <Input style={{ width: "95%" }} value={searchName} placeholder='Filter vist by name' onChange={(e) => setSearchName(e.target.value)} />
                </Col>
                <Col sm={24} md={12} lg={12} xl={12}>
                    <Select defaultValue="all" style={{ width: "95%" }} onChange={filterVisitsByPetId}>
                        <Select.Option value="all">All Pet Id</Select.Option>
                        {
                            pets && pets.map(pet => <Select.Option key={pet.petId} value={pet.petId}>{pet.type} - {pet.petId}</Select.Option>)
                        }
                    </Select>
                </Col>
                <Col span={24}>
                    <Title style={{ marginTop: "1rem", marginBottom: "0.5rem" }} level={4}>Filter visits by pet Ids</Title>
                    <Checkbox.Group options={petOptionForListSearch} onChange={onChangePetIds} />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={visits}
                rowKey={(record) => record.visitorId}
                pagination={false}
                loading={loading}
            />

            {/* Show Visit details modal */}
            <Modal width={800} title="Visit Details" visible={isVisitDetailsModalVisible} onOk={handleVisitDetailsOk} onCancel={handleVisitDetailsCancel}>
                <Card bordered={false} loading={loading}>
                    <p><b>Visit Id :</b><span style={{ marginLeft: "1rem" }}>{selectedVisit.visitorId}</span></p>
                    <p><b>Name :</b><span style={{ marginLeft: "1rem" }}>{selectedVisit.name}</span></p>
                    <p><b>Address :</b><span style={{ marginLeft: "1rem" }}>{selectedVisit.address}</span></p>
                    <p><b>Telephone No :</b><span style={{ marginLeft: "1rem" }}>{selectedVisit.telephone}</span></p>
                    <p><b>Pet Type - Pet Id  :</b><span style={{ marginLeft: "1rem" }}>{findPetNameById(selectedVisit.visitorId)} - <b>{selectedVisit.visitorId}</b></span></p>
                </Card>
            </Modal>

            {/* Add/Edit Visit modal */}
            <Modal width={700} title="Add or update Visit" visible={isSaveEditVisitModalVisible} onCancel={handleVisitSaveEditCancel} footer={null}>
                <Form form={addEditVisitForm} onFinish={onFinishAddEditVisit}>
                    <Form.Item name="name" label="Visitor Name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input placeholder="Enter Visit name" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required" }]}>
                        <Input placeholder="Enter your address" />
                    </Form.Item>
                    <Form.Item name="city" label="City" rules={[{ required: true, message: "City is required" }]}>
                        <Input placeholder="Enter your city" />
                    </Form.Item>
                    <Form.Item name="petId" label="Pet type - Pet Id" rules={[{ required: true, message: "Pet Id is required" }]} >
                        <Select>
                            {
                                pets && pets.map(pet => <Select.Option key={pet.petId} value={pet.petId}>{pet.type} - {pet.petId}</Select.Option>)
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

export default VisitComponent