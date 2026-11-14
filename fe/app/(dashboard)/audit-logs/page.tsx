"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminAuditLogs, AdminAuditLogItem } from "@/lib/api-compro";
import { Icon } from "@iconify/react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getAdminAuditLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">LOGIN</Badge>;
      case "LOGIN_FAILED":
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20">LOGIN GAGAL</Badge>;
      case "CREATE":
        return <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20">CREATE</Badge>;
      case "UPDATE":
        return <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20">UPDATE</Badge>;
      case "DELETE":
        return <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20">DELETE</Badge>;
      case "UPLOAD":
        return <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20">UPLOAD</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-default-900">Audit Log & Rekam Jejak Keamanan</h2>
          <p className="text-sm text-default-500">
            Pencatatan menyeluruh setiap aktivitas autentikasi, perubahan data konten CMS, dan operasi sistem untuk kepatuhan tata kelola IT.
          </p>
        </div>
        <Button onClick={loadData} variant="outline" className="text-default-700">
          <Icon icon="lucide:refresh-cw" className="mr-2 h-4 w-4" />
          Segarkan Log
        </Button>
      </div>

      <Card className="border border-default-200">
        <CardHeader>
          <CardTitle className="text-lg">Catatan Aktivitas Sistem ({logs.length})</CardTitle>
          <CardDescription>Immutable Audit Trail sesuai standar keamanan informasi ISO / Good Corporate Governance.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:loader-2" className="mx-auto h-8 w-8 animate-spin mb-2" />
              Memuat catatan audit...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-default-500">
              <Icon icon="lucide:shield" className="mx-auto h-12 w-12 text-default-300 mb-2" />
              <p>Belum ada catatan aktivitas keamanan yang terekam.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu Kejadian</TableHead>
                    <TableHead>Pengguna / Pelaku</TableHead>
                    <TableHead>Tipe Aksi</TableHead>
                    <TableHead>Modul</TableHead>
                    <TableHead>Metode & Endpoint</TableHead>
                    <TableHead>Alamat IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs text-default-600 font-mono whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }) : "-"}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-default-900">{item.user_email || "anonymous"}</span>
                      </TableCell>
                      <TableCell>{getActionBadge(item.action_type)}</TableCell>
                      <TableCell className="font-semibold text-xs text-default-700 uppercase">
                        {item.module_name || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-bold text-default-500">{item.http_method}</span>
                          <span className="text-default-700 truncate max-w-xs">{item.endpoint}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-default-500">
                        {item.ip_address || "127.0.0.1"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
