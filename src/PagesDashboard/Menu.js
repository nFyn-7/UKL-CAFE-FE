import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis';
import Sidebar from '../Components/Sidebar'
import Header from '../Components/Header';
import '../styles/menu.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilSquare, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"
import $ from "jquery";

export default class Menu extends React.Component {
    constructor() {
        super()
        this.state = {
            menu: [],
            id_menu: "",
            nama_menu: "",
            harga: "",
            dekripsi: "",
            gambar: "",
            jenis: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        }

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "admin" ||
                localStorage.getItem("role") === "kasir") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem("role")
            } else {
                window.alert("You're not admin or kasir!")
                window.location = "/"
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            gambar: e.target.files[0]
        })
    }

    handleCloseDetail = () => {
        $("#modal_detail").hide()
    }


    handleClose = () => {
        $("#modal_menu").hide()
    }

    handleAdd = () => {
        $("#modal_menu").show()
        this.setState({
            id_menu: "",
            nama_menu: "",
            harga: "",
            deskripsi: "",
            jenis: "",
            gambar: "",
            action: "insert"
        })
    }

    handleEdit = (item) => {
        $("#modal_menu").show()
        this.setState({
            id_menu: item.id_menu,
            nama_menu: item.nama_menu,
            harga: item.harga,
            deskripsi: item.deskripsi,
            jenis: item.jenis,
            gambar: item.gambar,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()

        let form = new FormData()
        form.append("id_menu", this.state.id_menu)
        form.append("nama_menu", this.state.nama_menu)
        form.append("harga", this.state.harga)
        form.append("deskripsi", this.state.deskripsi)
        form.append("jenis", this.state.jenis)
        form.append("gambar", this.state.gambar)

        if (this.state.action === "insert") {
            let url = "http://localhost:8000/menu"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    this.getmenu()
                    this.handleClose()
                })
                .catch(error => {
                    console.log("error add data", error.response.status)
                    if (error.response.status === 500) {
                        window.alert("Failed to add data");
                    }
                })
        } else {
            let url = "http://localhost:8000/menu/" + this.state.id_menu
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getmenu()
                    this.handleClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:8000/menu/" + id
        if (window.confirm("Are tou sure to delete this menu ? ")) {
            axios.delete(url, this.headerConfig())
                .then(response => {
                    console.log(response.data.message)
                    this.getmenu()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        window.alert("You can't delete this data");
                    }
                })
        }
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8000/menu/find"
        axios.post(url, data, this.headerConfig())
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        menu: response.data.data
                    })
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    getmenu = () => {
        let url = "http://localhost:8000/menu";
        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    menu: response.data.data,
                });
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "kasir") {
            localStorage.clear()
            window.alert("You're not admin or kasir!")
            window.location = '/'
        }
    }

    componentDidMount() {
        this.getmenu()
        this.checkRole()
    }

    render() {
        return (
            <div class="flex flex-row min-h-screen bg-gray-100 text-gray-800">
                <Sidebar />
                <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
                    <Header />
                    <div class="main-content flex flex-col flex-grow p-4">
                        <h1 class="font-bold text-xl text-black-700">Daftar menu</h1>
                        <div class="mb-4">
                            <div className="flex items-center">
                                <div className="flex rounded w-1/2">
                                    <input
                                        type="text"
                                        className="w-4/6 block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                        placeholder="Search..."
                                        name="keyword"
                                        value={this.state.keyword}
                                        onChange={this.handleChange}
                                    />
                                    <button className="w-1/8 ml-2 px-4 text-white bg-blue-100 border border-1 border-blue-600 rounded hover:bg-blue-200" onClick={this._handleFilter}>
                                        <FontAwesomeIcon icon={faSearch} color="blue" />
                                    </button>
                                    {this.state.role === "admin" &&
                                        <button className="w-1/5 ml-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => this.handleAdd()}>
                                            <FontAwesomeIcon icon={faPlus} /> Add
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            {this.state.menu.map((item, index) => {
                                return (
                                    <div class="col-span-1">
                                        {/* Card untuk type room */}
                                        <div class="CardEvent" key={index}>
                                            <div class="max-w-sm rounded overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-100">
                                                <div className='container'>
                                                    <img class="w-full h-48" src={"http://localhost:8000/gambar/" + item.gambar} alt='' />
                                                    {this.state.role === "admin" &&
                                                        <>
                                                            <button class='btn' onClick={() => this.handleDrop(item.id_menu)}><FontAwesomeIcon icon={faTrash} size="lg" color="red" /></button>
                                                            <button class='btn1' onClick={() => this.handleEdit(item)}><FontAwesomeIcon icon={faPencilSquare} size="xl" color="orange" /></button>
                                                        </>
                                                    }

                                                </div>
                                                <div class="px-6 py-4">
                                                    <div class="font-bold text-2xl mb-2">Nama: {item.nama_menu}</div>
                                                    <div class="font-bold text-xl mb-2 text-blue-600">Harga: {item.harga}</div>
                                                    <p class="text-gray-700 text-base">
                                                        <LinesEllipsis
                                                            text={item.deskripsi}
                                                            maxLine="3"
                                                            ellipsis="..." />
                                                    </p>
                                                    <div class="font-bold text-xl mb-2 text-blue-600">Jenis: {item.jenis}</div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <footer class="footer px-4 py-2">
                        <div class="footer-content">
                            <p class="text-sm text-gray-600 text-center">© Brandname 2023. All rights reserved. <a href="https://twitter.com/iaminos">by Erairris</a></p>
                        </div>
                    </footer>
                </main >

                {/* Modal Form */}
                <div id="modal_menu" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">Edit Menu</h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleSave(event)}>
                                    <div>
                                        <label for="nama_menu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">nama menu</label>
                                        <input type="text" name="nama_menu" id="nama_menu" value={this.state.nama_menu} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan nama makanan" required />
                                    </div>
                                    <div>
                                        <label for="harga" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">harga</label>
                                        <input type="number" name="harga" id="harga" value={this.state.harga} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan harga makanan" required />
                                    </div>
                                    <div>
                                        <label for="deskripsi" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">deskripsi </label>
                                        <textarea rows="3" type="text" name="deskripsi" id="deskripsi" value={this.state.deskripsi} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan deskripsi makanan" />
                                    </div>
                                    <div>
                                        <label for="jenis" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">jenis</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Jenis jenis" name="jenis" value={this.state.jenis} onChange={this.handleChange} required>
                                            <option value="">Pilih jenis</option>
                                            <option value="makanan">makanan</option>
                                            <option value="minuman">minuman</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="gambar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">gambar </label>
                                        <input type="file" name="gambar" id="gambar" placeholder="Pilih gambar menu" onChange={this.handleFile} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full px-2 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" required={this.state.action === "update" ? false : true} />
                                    </div>

                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}