import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faPrint,
    faPencilSquare,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import axios from "axios";
import $ from "jquery";
import moment from "moment";

export default class HitoryTransaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi: [],
            detailTransaksi: [],
            menu: [],
            mejaa: [],
            user: [],
            id_transaksi: "",
            id_user: "",
            id_menu: "",
            id_meja: "",
            nama_pelanggan: "",
            meja: "",
            nama_user: "",
            grandtotal: "",
            tgl_transaksi: "",
            status: "",
            status_meja: "",
            role: "",
            token: "",
            action: "",
            keyword: "",
        };

        if (localStorage.getItem("token")) {
            if (
                localStorage.getItem("role") === "admin" ||
                localStorage.getItem("role") === "kasir" ||
                localStorage.getItem("role") === "manajer"
            ) {
                this.state.token = localStorage.getItem("token");
                this.state.role = localStorage.getItem("role");
            } else {
                window.alert("You're not admin or kasir!");
                window.location = "/";
            }
        }
    }

    printData = (e) => {
        e.preventDefault();
        const input = document.getElementById('struk');

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('transaction.pdf');
        });
    };

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` },
        };
        return header;
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleClose = () => {
        $("#modal_Transaksi").hide();
        $("#struk").hide();
    };
    handleCloseEdit = () => {
        $("#modal_edit").hide();
    }
    handleEditStatus = (item) => {
        $("#modal_edit").show();
        this.setState({
            id_transaksi: item.id_transaksi,
            status: item.status,
            action: "update",
        });
    };
    handleAddTransaksi = () => {
        let form = {
            id_transaksi: this.state.id_transaksi,
            status: this.state.status,
            grandtotal: this.state.grandtotal,
            id_meja: this.state.id_meja,
            id_user: this.state.id_user,
            detail_transaksi: [{
                id_menu: this.state.id_menu,
                qty: this.state.qty,
            }],
            nama_pelanggan: this.state.nama_pelanggan,
            meja: this.state.meja,
        };
        let url = "http://localhost:8000/transaksi"
        axios.post(url, form, this.headerConfig())
            .then(response => {
                this.getTransaksi()
                this.handleClose()
                window.location = "/historytransaksi"
            })
            .catch(error => {
                console.log("error add data", error)
                if (error.response.status === 500 || error.response.status === 404) {
                    window.alert("Failed Transaksi room");
                }
            })
    }
    handleAdd = (item) => {
        $("#modal_Transaksi").show();
        this.setState({
            id_transaksi: item.id_transaksi,
            status: item.status,
            id_meja: item.id_meja,
            id_user: item.id_user,
            id_menu: item.id_menu,
            nama_pelanggan: item.nama_pelanggan,
            meja: item.meja,
            grandtotal: item.grandtotal,
            qty: item.qty,
            action: "insert",
        });
    };

    handleSave = (e) => {
        e.preventDefault();

        let form = {
            id_transaksi: this.state.id_transaksi,
            status: this.state.status,
            id_meja: this.state.id_meja,
            id_user: this.state.id_user,
            id_menu: this.state.id_menu,
            nama_pelanggan: this.state.nama_pelanggan,
            meja: this.state.meja,

            harga: this.state.harga,
        };
        let formedit = {
            id_transaksi: this.state.id_transaksi,
            status: this.state.status,
        };
        if (this.state.action === "insert") {
            let url = "http://localhost:8000/transaksi"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    this.getUser()
                    this.getTransaksi();
                    this.handleClose()
                })
                .catch(error => {
                    console.log("error add data", error.response.status)
                    if (error.response.status === 500) {
                        window.alert("Failed to add data");
                    }
                })
        } else {
            let url = "http://localhost:8000/transaksi/" + this.state.id_transaksi;
            axios
                .put(url, formedit, this.headerConfig())
                .then((response) => {
                    this.getTransaksi();
                    //   this.getTypeRoom();
                    this.getUser();
                    this.handleClose();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    _handleFilter = () => {
        let data = {
            nama_pelanggan: this.state.keyword,
        };
        let url = "http://localhost:8000/transaksi/find";
        axios
            .post(url, data, this.headerConfig())
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        transaksi: response.data.data,
                    });
                } else {
                    alert(response.data.message);
                    this.setState({ message: response.data.message });
                }
            })
            .catch((error) => {
                console.log("error", error.response.status);
            });
    };

    detailStruk = (id) => {
        $("#struk").show();
        let url = `http://localhost:8000/transaksi/${id}`;

        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    detailTransaksi: response.data.data,
                });
                console.log(this.detailStruk);
                console.log(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    getTransaksi = () => {
        let url = "http://localhost:8000/transaksi";

        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    transaksi: response.data.data,
                });
                console.log(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getTypeRoom = () => {
        let url = "http://localhost:8000/meja/get";
        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    meja: response.data.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getUser = () => {
        let url = "http://localhost:8000/user/get";
        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    user: response.data.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "kasir" && this.state.role !== "manajer") {
            localStorage.clear();
            window.alert("You're not admin or kasir!");
            window.location = "/";
        }
    };

    componentDidMount() {
        this.getTransaksi();
        this.getTypeRoom();
        this.getUser();
        this.checkRole();
    }

    render() {
        return (
            <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
                <Sidebar />
                <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <Header />
                    <div class="main-content flex flex-col flex-grow p-4">
                        <h1 class="font-bold text-xl text-black-700">
                            Daftar History Transaksi Customer
                        </h1>

                        <div className="flex mt-2 flex-row-reverse">
                            <div className="flex rounded w-1/3 mr-4">
                                <input
                                    type="text"
                                    className="w-2/3 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 "
                                    placeholder="Search by name"
                                    name="keyword"
                                    value={this.state.keyword}
                                    onChange={this.handleChange}
                                />
                                <button
                                    className="w-1/3 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                                    onClick={this._handleFilter}
                                >
                                    <FontAwesomeIcon icon={faSearch} size="" />
                                </button>
                                {this.state.role === "admin" && (
                                    <button
                                        className="w-1/3 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => this.handleAdd()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} size="" /> Add
                                    </button>
                                )}
                                {this.state.role === "kasir" && (
                                    <button
                                        className="w-1/3 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => this.handleAdd()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} size="" /> Add
                                    </button>
                                )}

                            </div>
                        </div>

                        <div className="flex flex-col mt-2 mr-4">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table id="table" className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        id transaksi
                                                    </th>
                                                    {/* <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nama User
                          </th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Nama pelanggan
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Tanggal transaksi
                                                    </th>
                                                    {/* <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Grandtotal
                                                    </th> */}
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Status
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        aksi
                                                    </th>
                                                    {this.state.role === "kasir" && (
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        </th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {/* {console.log(this.state.transaksi)} */}
                                                {Array.isArray(this.state.transaksi) &&
                                                    this.state.transaksi.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">{index + 1}</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        {item.nama_pelanggan}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        {moment(item.tgl_transaksi).format(
                                                                            "DD-MM-YYYY"
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        {item.grandtotal}
                                                                    </div>
                                                                </td> */}
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {item.status === "belum_bayar" && (
                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                                            {item.status}
                                                                        </span>
                                                                    )}
                                                                    {item.status === "lunas" && (
                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                            {item.status}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                {this.state.role === "kasir" && (
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <button
                                                                            className={`bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2 ${item.status === ""
                                                                                ? "opacity-50 cursor-not-allowed"
                                                                                : ""
                                                                                }`}
                                                                            onClick={() =>
                                                                                this.handleEditStatus(item)
                                                                            }
                                                                            disabled={
                                                                                item.status === ""
                                                                            }
                                                                        > 
                                                                            <FontAwesomeIcon
                                                                                icon={faPencilSquare}
                                                                                size="lg"
                                                                            />
                                                                        </button>
                                                                    </td>
                                                                )}
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.detailStruk(item.id_transaksi)}>  <FontAwesomeIcon icon={faPrint} size="lg" /></button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer class="footer px-4 py-2">
                        <div class="footer-content">
                            <p class="text-sm text-gray-600 text-center">
                                © Brandname 2023. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </main>

                {/* Modal Form */}
                <div id="modal_Transaksi" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Edit Status Transaksi{" "}
                                </h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleAddTransaksi(event)}>
                                    <div>
                                        <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama_pelanggan</label>
                                        <input type="text" name="nama_pelanggan" id="nama_pelanggan" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nama_pelanggan user" required />
                                    </div>
                                    <div>
                                        <label for="id_meja" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id_meja</label>
                                        <input type="text" name="id_meja" id="id_meja" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id_meja" required />
                                    </div>
                                    <div>
                                        <label for="id_user" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id_user</label>
                                        <input type="text" name="id_user" id="id_user" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id_user" required />
                                    </div>
                                    <div>
                                        <label for="id_menu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">id_menu</label>
                                        <input type="text" name="id_menu" id="id_menu" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan id_menu " required />
                                    </div>
                                    <div>
                                        <label for="harga" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">harga</label>
                                        <input type="number" name="harga" id="harga" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan Harga Menu" required />
                                    </div>
                                    <div>
                                        <label for="qty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Jumlah</label>
                                        <input type="number" name="qty" id="qty" onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan Jumlah" required />
                                    </div>
                                    <div>
                                        <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">
                                            Status
                                        </label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Pilihan status" name="status" value={this.state.status} onChange={this.handleChange} required>
                                            <option value="">Pilih Status</option>
                                            <option value="belum_bayar">belum_bayar</option>
                                            <option value="lunas">lunas</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="struk" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Detail Transaksi{" "}
                                </h3>
                                <form class="space-y-6" >
                                    <div>
                                        <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama_pelanggan : {this.state.detailTransaksi.nama_pelanggan}</label>
                                    </div>
                                    <div>
                                        <label for="nama_menu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama_menu : {this.state.detailTransaksi.nama_menu}</label>
                                    </div>
                                    <div>
                                        <label for="harga" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Harga :  {this.state.detailTransaksi.harga}</label>

                                    </div>
                                    <div>
                                        <label for="jumlah" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Jumlah : {this.state.detailTransaksi.qty}</label>

                                    </div>
                                    <div>
                                        <label for="subtotsl" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Subtotal : {this.state.detailTransaksi.qty * this.state.detailTransaksi.harga}</label>

                                    </div>
                                    <div>
                                        <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Status : {this.state.detailTransaksi.status}</label>

                                    </div>
                                    <div>
                                        <label for="meja" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">tanggal transaksi :  {this.state.detailTransaksi.tgl_transaksi}</label>

                                    </div>

                                    <button onClick={this.printData} type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                        print
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal edit */}
                <div
                    id="modal_edit"
                    tabindex="-1"
                    aria-hidden="true"
                    class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
                >
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button
                                type="button"
                                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                onClick={() => this.handleCloseEdit()}
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                                    Edit Status Transaksi{" "}
                                </h3>
                                <form
                                    class="space-y-6"
                                    onSubmit={(event) => this.handleSave(event)}
                                >
                                    <div>
                                        <label
                                            for="status"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                                        >
                                            Status
                                        </label>
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                                            placeholder="Pilihan status"
                                            name="status"
                                            value={this.state.status}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="belum_bayar">belum_bayar</option>
                                            <option value="lunas">lunas</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={this.handlePrintToPDF}
                                        type="submit"
                                        class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Form */}
                {/* <div
          id="modal_pemesanan"
          tabindex="-1"
          aria-hidden="true"
          className="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div className="flex lg:h-auto w-auto justify-center ">
            <div className="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.handleClose()}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Tutup modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  Add Pemesanan
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={(event) => this.handleSave(event)}
                >
                  <div>
                    <label
                      for="nomor_pemesanan"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Nomor Pemesanan
                    </label>
                    <input
                      type="text"
                      name="nomor_pemesanan"
                      id="nomor_pemesanan"
                      value={this.state.nomor_pemesanan}
                      onChange={this.handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan number of room"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="nomor_kamar"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Nomor Kamar
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Nama Pemesan"
                      name="nama_pemesan"
                      value={this.state.nomor_kamar}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="">Pilih Nomor Kamar</option>
                      {this.state.typeroom.map((item) => (
                        <option value={item.id}>
                          {item.nama_tipe_kamar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div> */}
            </div>
        );
    }
}