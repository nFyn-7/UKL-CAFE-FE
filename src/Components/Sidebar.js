import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faHome, faTable, faUser, faHistory, faUtensils } from "@fortawesome/free-solid-svg-icons";

export default class Sidebar extends React.Component {
    constructor() {
        super()
        this.state = {
            role: "",

        }
        this.state.role = localStorage.getItem("role")
    }

    logOut = () => {
        if (window.confirm("Are you sure to logout")) {
            window.location = '/'
            localStorage.clear()
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("email")
            localStorage.removeItem("username")
        }
    }

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "kasir" && this.state.role !== "manajer") {
            localStorage.clear()
            window.alert("You're not admin, kasir or manajer!")
            window.location = '/'
        }
    }

    componentDidMount() {
        this.checkRole()
    }

    render() {
        return (

            <aside
                class="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-white"
            >
                <div class="sidebar-header flex items-center justify-center py-4">
                    <div class="inline-flex">
                        <a href="#" class="inline-flex flex-row items-center">
                            <img src="/assets/logo.jpg" class="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20" alt='' />
                            <span class="leading-10 text-brown-600 text-2xl font-bold ml-1 uppercase">Yorushika Cafe</span>
                        </a>
                    </div>
                </div>
                <div class="sidebar-content px-4 py-6">
                    <ul class="flex flex-col w-full">
                        <li class="my-px">
                            <a
                                href="/dashboard"
                                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span class="mr-2 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faHome} color="blue" />
                                </span>
                                <span class="ml-3">Dashboard</span>
                            </a>
                        </li>
                        {localStorage.role === "admin" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/meja"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-2 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faTable} color="blue" />
                                        </span>
                                        <span class="ml-3">Meja</span>
                                    </a>
                                </li>
                            </>
                        )}
                        {localStorage.role === "kasir" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/meja"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-2 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faTable} color="blue" />
                                        </span>
                                        <span class="ml-3">Meja</span>
                                    </a>
                                </li>
                            </>
                        )}
                        {localStorage.role === "admin" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/menu"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faUtensils} color="blue" />
                                        </span>
                                        <span class="ml-3">Menu</span>
                                    </a>
                                </li>
                            </>
                        )}
                        {localStorage.role === "kasir" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/menu"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faUtensils} color="blue" />
                                        </span>
                                        <span class="ml-3">Menu</span>
                                    </a>
                                </li>
                            </>
                        )}
                        {localStorage.role === "admin" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/user"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faUser} color="blue" />
                                        </span>
                                        <span class="ml-4">User</span>
                                    </a>
                                </li>
                            </>
                        )}
                        {/* <li class="my-px">
                            <a
                                href="/customer"
                                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faUsers} color="blue" />
                                </span>
                                <span class="ml-2">Customer</span>
                            </a>
                        </li> */}
                        {localStorage.role === "manajer" && (
                            <>
                                <li class="my-px">
                                    <a
                                        href="/statistika"
                                        class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                                    >
                                        <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                            <FontAwesomeIcon icon={faChartSimple} color="blue" />
                                        </span>
                                        <span class="ml-4">Statistika</span>
                                    </a>
                                </li>
                            </>
                        )}
                        <li class="my-px">
                            <a
                                href="/historytransaksi"
                                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faHistory} color="blue" />
                                </span>
                                <span class="ml-3">History Transaksi</span>
                            </a>
                        </li>
                        {/* <li class="my-px">
                            <a
                                href="/cetak"
                                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faHistory} color="blue" />
                                </span>
                                <span class="ml-3">Cetak</span>
                            </a>
                        </li> */}
                        <li class="my-px">
                            <a
                                href="/"
                                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 mt-32"
                            >
                                <span class="mr-3 flex items-center justify-center text-lg text-red-400">
                                    <svg
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        class="h-6 w-6"
                                    >
                                        <path
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                        />
                                    </svg>
                                </span>
                                <span class="ml-2" onClick={() => this.logOut()}>Logout</span>
                            </a>
                        </li>
                    </ul>

                </div>
            </aside>

        )
    }
}