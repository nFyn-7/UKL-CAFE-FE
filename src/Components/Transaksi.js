import React from "react";
import Media from "../media/media";

export default class TransactionTable extends React.Component {
  render() {
    return (
      <tr className={this.props.className}>
        <td>{this.props.no}</td>
        <td>{this.props.id_transaksi}</td>
        <td>{this.props.tgl_transaksi}</td>
        <td>{this.props.id_user}</td>
        <td>{this.props.id_meja}</td>
        <td>{this.props.nama_pelanggan}</td>
        <td>{this.props.status}</td>
        {/* <td>{this.props.tgl_check_out}</td>
        <td>{this.props.nama_tamu}</td>
        <td>{this.props.jumlah_kamar}</td>
        <td>RP. {this.props.harga}</td>
        <td>{this.props.status_pemesanan}</td> */}
        <td style={{ minWidth: "60px" }}>
          <button className="btn btn-edit mx-1" onClick={this.props.onEdit}>
            <Media value image="icon-edit.svg" alt="icon-edit.svg" />
          </button>
        </td>
      </tr>
    );
  }
}