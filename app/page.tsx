import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function Page() {
  const { data, error } = await supabase
    .from("properties")
    .select("name, kind, armed")
    .limit(1)
    .single()

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Vigil</h1>
        <p className="mt-1 text-sm text-gray-500">Week 0 — setup check</p>

        {error ? (
          <p className="mt-6 text-sm text-red-600">{error.message}</p>
        ) : (
          <div className="mt-6">
            <p className="text-3xl font-bold text-gray-900">{data.name}</p>
            <p className="mt-1 text-sm text-gray-500">{data.kind}</p>
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                data.armed ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {data.armed ? "ARMED" : "DISARMED"}
            </span>
            <p className="mt-4 text-xs text-green-600">Supabase connected</p>
          </div>
        )}
      </div>
    </main>
  )
}
