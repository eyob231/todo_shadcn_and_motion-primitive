'use client'
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { Button} from '@/components/ui/button'
import { Card, CardContent, CardHeader, } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertDialog,AlertDialogAction,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertCircle } from "lucide-react"
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { Tilt } from '@/components/motion-primitives/tilt'
export default function Todo() {
    const [todo, setTodo] = useState<string>("")
    const [showAlert, setShowAlert] = useState(false)
    interface TodoItem {
        id: string;
        todo: string;
        completed: boolean;
    }
    const [todos, setTodos] = useState<TodoItem[]>([])
    
    useEffect(() => {
        refetch()
    }, [])
    
    const refetch = async () => {
        const { data, error } = await supabase.from('todo').select(
            'id,todo,completed'
        )
        if (error) {
            console.log(error)
            return
        }
        setTodos(data)
    }
    const handleComplete= async(id:string)=>{
        const{error}= await supabase.from('todo').update({completed:true}).eq('id',id)
        if (error){
            console.log(error)
            return
        }
        refetch()
    }
    const existingTodo = todos.find(item => item.todo === todo);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!existingTodo){
        const { error } = await supabase.from('todo').insert({
            id: crypto.randomUUID(),
            todo: todo,
            completed: false,
        })
        if (error) {
            console.log(error)
            return
        }
        // Clear input on success
        setTodo("")
        refetch()
    }else{
       setShowAlert(true)
       console.log("Todo already exists")

    }
    }
    const handleDelete= async(id:string)=>{
        const {error}=await supabase.from('todo').delete().eq('id',id)
        if (error){
            console.log(error)
            return
        }
        refetch()
    }

    return (
        <>
        <Tilt rotationFactor={10} isRevese={true}>
        <Card className="w-[600px] bg-blue-500 m-auto mt-30">
            <CardHeader>
            <form onSubmit={handleSubmit}>
            <Input
            className="w-full p-2 border border-black-300 rounded"
                value={todo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
                type="text"
            />
            
            <Button type="submit" onClick={refetch}>
                Add Todo</Button>
        </form>
            </CardHeader>
        <CardContent>
        <ul className="color-red ml-10">
            
            {todos.map((item) => (
                <>
                <div className="flex items-center gap-2">
                <li key={item.id} className="color-red text-2xl list-disc " style={{textDecoration: item.completed ? 'line-through' : 'none'}}><TextEffect per='char' preset='fade-in-blur'>{item.todo}</TextEffect></li>
                <Button className="bg-red-500 " type="submit" onClick={()=>handleDelete(item.id)}>Delete</Button>
                <Button className="bg-green-500 " type="submit" onClick={()=>handleComplete(item.id)}>Complete</Button>
                </div>
                </>
            ))}
        </ul>
        </CardContent>
        </Card>
        </Tilt>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-500" size={24} />
              <AlertDialogTitle>Todo Already Exists</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              The todo {todo} already exists in your list. Please enter a unique todo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </>
    )
}
