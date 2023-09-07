import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Table, Tbody, Tr, Td, Box } from "@chakra-ui/react";
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPrint,
  faPencilSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $ from "jquery";
import moment from "moment";
import "@progress/kendo-theme-material/dist/all.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import TextPoppins from "../Components/TextPoppins";
import jsPDF from 'jspdf';


const PrintElement = (props) => {
  const { item } = props;

  return (
    <Box w={"100vw"} h={"100vh"}>
      <Table variant="simple" maxW={"100%"} mx={"auto"}>
        <Tbody>
          <Tr>
            <Td colSpan={2} textAlign={"center"}>
              <TextPoppins
                text={`Cetak Pemesanan`}
                fontSize={"md"}
                fontWeight={600}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins text={"Nama:"} fontSize={"md"} fontWeight={400} />
            </Td>
            <Td>{item.nama_pelanggan}</Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins text={`Tanggal Transaksi`} fontSize={"md"} fontWeight={400} />
            </Td>
            <Td>{new Date(item.tgl_transaksi).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Status"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>
              {item.status}
            </Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Nama menu"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>
              {item.id_menu}
            </Td>
          </Tr>
          <Tr>
            <Td>
              <TextPoppins
                text={"Total harga"}
                fontSize={"md"}
                fontWeight={400}
              />
            </Td>
            <Td>
              {item.grandtotal}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default class HitoryTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      transaksi: [],
      menu: [],
      mejaa: [],
      user: [],
      id_transaksi: "",
      id_user: "",
      id_menu: "",
      id_meja: "",
      nama_menu: "",
      nama_pelanggan: "",
      meja: "",
      nama_user: "",
      grandtotal: "",
      qty: "",
      tgl_transaksi: "",
      status: "",
      status_meja: "",
      laporan: "",
      role: "",
      token: "",
      action: "",
      keyword: "",
      dataPrint: {},
      container: React.createRef(null),
      pdfExportComponent: React.createRef(null),
      isPrint: false
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
        window.alert("You're not admin, kasir or manajer!");
        window.location = "/";
      }
    }
  }

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
  };
  handleCloseEdit = () => {
    $("#modal_edit").hide();
  };

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
      detail_transaksi: [
        {
          id_menu: this.state.id_menu,
          qty: this.state.qty,
        },
      ],
      nama_pelanggan: this.state.nama_pelanggan,
      meja: this.state.meja,
      nama_user: this.state.nama_user,
    };
    let url = "http://localhost:8000/transaksi";
    axios
      .post(url, form, this.headerConfig())
      .then((response) => {
        this.getTransaksi();
        this.handleClose();
        window.location = "/historytransaksi";
      })
      .catch((error) => {
        console.log("error add data", error);
        if (error.response.status === 500 || error.response.status === 404) {
          window.alert("Failed Transaksi room");
        }
      });
  };

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
      nama_user: item.nama_user,
      grandtotal: item.grandtotal,
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
      nama_user: this.state.nama_user,
      grandtotal: this.state.grandtotal,
    };
    let formedit = {
      id_transaksi: this.state.id_transaksi,
      status: this.state.status,
    };
    if (this.state.action === "insert") {
      let url = "http://localhost:8000/transaksi";
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          this.getUser();
          this.getTransaksi();
          this.handleClose();
          this.handleCloseEdit();
        })
        .catch((error) => {
          console.log("error add data", error.response.status);
          if (error.response.status === 500) {
            window.alert("Failed to add data");
          }
        });
    } else {
      let url = "http://localhost:8000/transaksi/" + this.state.id_transaksi;
      axios
        .put(url, formedit, this.headerConfig())
        .then((response) => {
          this.getTransaksi();
          //   this.getTypeRoom();
          this.getUser();
          this.handleClose();
          this.handleCloseEdit();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  getlaporan = () => {
    axios.get("http://localhost:8000/admin/laporan")
      .then(res => {
        this.Laporan()
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

  // save = () => {
  //   let data = {
  //     detail_trans: cartItems
  //   }
  //   axios.post("http://localhost:8000/transaksi/save", data)
  //     .then(data => {
  //       if (data.data.status == true) {
  //         showToast(data.data.message)
  //         checkout()
  //       } else {
  //         showToast(data.data.message)
  //       }
  //     })
  //     .catch(error => {
  //       alert(error)
  //     })
  // }

  // showToast = (message) => {
  //   let myToast = new Toast(
  //     document.getElementById(`myToast`),
  //     {
  //       autohide: true
  //     }
  //   )
  //   /** perintah utk mengisi state 'message' */
  //   setMessage(message)
  //   /** show Toast */
  //   myToast.show()
  // }

  checkRole = () => {
    if (
      this.state.role !== "admin" &&
      this.state.role !== "kasir" &&
      this.state.role !== "manajer"
    ) {
      localStorage.clear();
      window.alert("You're not admin, kasir or manajer!");
      window.location = "/";
    }
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

  // handlePrint = (id) => {
  //   let url = "http://localhost:8000/transaksi/detail/" + $(id);
  //   axios
  //     .get(url, this.headerConfig())
  //     .then((response) => {
  //       this.setState({
  //         detailTransaksi: response.data.data,
  //       });
  //       console.log(this.detailStruk);
  //       console.log(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  componentDidMount() {
    this.getTransaksi();
    // this.getTypeRoom();
    // this.getUser();
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
                  placeholder="Search..."
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            id transaksi
                          </th>
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
                            nama menu
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            harga
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tanggal transaksi
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          {this.state.role === "kasir" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
                            </th>
                          )}
                          {this.state.role === "manajer" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
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
                                  <div className="text-sm text-gray-900">
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {item.nama_pelanggan}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {item.nama_menu}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {item.grandtotal}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {moment(item.tgl_transaksi).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </div>
                                </td>
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
                                <>
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
                                        disabled={item.status === ""}
                                      >
                                        <FontAwesomeIcon
                                          icon={faPencilSquare}
                                          size="lg"
                                        />
                                      </button>
                                    </td>
                                  )}
                                </>
                                {this.state.role === "manajer" && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.detailStruk(item.id_transaksi)}>
                                      <FontAwesomeIcon icon={faPrint} size="lg" />
                                    </button>
                                  </td>
                                )}
                                {this.state.role === "kasir" && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.detailStruk(item.id_transaksi)}>
                                      <FontAwesomeIcon icon={faPrint} size="lg" />
                                    </button>
                                  </td>
                                )}
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
        <div
          id="modal_Transaksi"
          tabindex="-1"
          aria-hidden="true"
          class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div class="flex lg:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.handleClose()}
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
                  onSubmit={(event) => this.handleAddTransaksi(event)}
                >
                  <div>
                    <label
                      for="nama_pelanggan"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      nama_pelanggan
                    </label>
                    <input
                      type="text"
                      name="nama_pelanggan"
                      id="nama_pelanggan"
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan nama_pelanggan user"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="meja"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      nomor_meja
                    </label>
                    <input
                      type="text"
                      name="meja"
                      id="meja"
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan nomor meja"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="nama_user"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      nama_user
                    </label>
                    <input
                      type="text"
                      name="nama_user"
                      id="nama_user"
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan user"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="subtotal"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      harga
                    </label>
                    <input
                      type="number"
                      name="subtotal"
                      id="subtotal"
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan harga"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="nama_menu"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Nama Menu
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Pilihan Menu"
                      name="id_menu"
                      value={this.state.id_menu}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="">Pilih Menu</option>
                      <option value="2">Rujak</option>
                      <option value="4">Cappucino</option>
                      <option value="5">Gacoan</option>
                    </select>
                  </div>
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
                    type="submit"
                    class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
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
                    type="submit"
                    class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="hidden-on-narrow"
        >
          <PDFExport ref={this.state.pdfExportComponent}>
            <div ref={this.state.container}>
              {this.state.isPrint ? <PrintElement item={this.state.dataPrint} /> : null}
            </div>
          </PDFExport>
        </div>
      </div>
    );
  }
}