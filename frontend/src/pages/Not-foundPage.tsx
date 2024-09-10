import Layout from '@/components/Layout/Layout'

const NotfoundPage = () => {
  return (
    <Layout>
        <div className="min-h-screen flex flex-col gap-4 text-white justify-center items-center mx-auto text-3xl font-semibold">
            <h1 className="text-[5rem] font-bold">
                404
            </h1>
            <p className="">
                page not found
            </p>
        </div>
        </Layout>
  )
}

export default NotfoundPage